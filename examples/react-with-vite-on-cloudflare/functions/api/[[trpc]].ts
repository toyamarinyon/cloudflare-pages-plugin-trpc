import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import tRPCPlugin, {
  FetchCreateContextWithCloudflareEnvFnOptions,
} from "cloudflare-pages-plugin-trpc";
import { getWebCryptSession } from "webcrypt-session/adapters/trpc";
import { z } from "zod";
import { getAccessToken, getUser } from "../../src/model/github";
import { sessionScheme } from "../../src/model/session";
import { createTaskScheme, Task, taskScheme } from "../../src/model/task";

export interface Env {
  DB: D1Database;
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  SESSION_SECRET: string;
}
const createContext = async ({
  req,
  env,
}: FetchCreateContextWithCloudflareEnvFnOptions<Env>) => {
  const session = await getWebCryptSession(sessionScheme, req, {
    password: env.SESSION_SECRET,
  });
  return {
    session,
    db: env.DB,
    github: {
      clientId: env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
    },
  };
};
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const tasksRouter = t.router({
  create: t.procedure
    .input(createTaskScheme)
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .prepare(
          "INSERT INTO tasks (title, description, user_id) SELECT ?, ?, user_id FROM sessions WHERE id = ?"
        )
        .bind(input.title, input.description, ctx.session.id)
        .run<Task>();

      if (!result.success) {
        throw new Error(result.error);
      }
    }),
  complete: t.procedure
    .input(taskScheme.pick({ id: true }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .prepare("UPDATE tasks SET completion_datetime = ? WHERE id = ?")
        .bind(new Date().valueOf(), input.id)
        .run<Task>();

      if (!result.success) {
        throw new Error(result.error);
      }
    }),
  list: t.procedure.query(async ({ ctx }) => {
    const { results: tasks } = await ctx.db
      .prepare(
        "SELECT tasks.* FROM tasks INNER JOIN sessions ON sessions.user_id = tasks.user_id WHERE sessions.id = ? AND completion_datetime IS NULL"
      )
      .bind(ctx.session.id)
      .all<Task>();
    return {
      tasks,
    };
  }),
});

const authenticationRouter = t.router({
  currentUser: t.procedure.query(async ({ ctx }) => {
    if (ctx.session.id == null) {
      return { currentUser: null };
    }
    const session = await ctx.db
      .prepare("SELECT id, user_id FROM sessions WHERE id = ?")
      .bind(ctx.session.id)
      .first<{ id: number; user_id: number }>();
    if (session == null) {
      return { currentUser: null };
    }

    const user = await ctx.db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(session.user_id)
      .first<{ github_oauth_token: string }>();

    /**
     * @todo if expired, refresh token
     */
    const githubUser = await getUser(user.github_oauth_token);

    return { currentUser: githubUser };
  }),
  login: t.procedure
    .input(z.object({ oauthToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("a");
        const accessToken = await getAccessToken({
          code: input.oauthToken,
          clientId: ctx.github.clientId,
          clientSecret: ctx.github.clientSecret,
        });
        console.log("b");
        const githubUser = await getUser(accessToken);
        console.log("c");

        const users = await ctx.db.prepare("SELECT * FROM users").all();
        console.log(users?.results?.length);
        const user = await ctx.db
          .prepare("SELECT id FROM users WHERE github_user_id = ?")
          .bind(githubUser.id)
          .all<{ id: number }>();

        console.log("d");
        /**
         * @todo use const
         */
        let dbUserId = user?.results?.[0]?.id;
        if (dbUserId == null) {
          await ctx.db
            .prepare(
              "INSERT INTO users (github_user_id, github_oauth_token) VALUES (?, ?)"
            )
            .bind(githubUser.id, accessToken)
            .run();
          const { id } = await ctx.db
            .prepare("SELECT last_insert_rowid() as id")
            .first<{ id: number }>();
          dbUserId = id;
        } else {
          await ctx.db
            .prepare("UPDATE users SET github_oauth_token = ? WHERE id = ?")
            .bind(accessToken, dbUserId)
            .run();
        }
        const sessionId = crypto.randomUUID();
        await ctx.db
          .prepare("INSERT INTO sessions (id, user_id) VALUES (?, ?)")
          .bind(sessionId, dbUserId)
          .run();
        await ctx.session.save({
          id: sessionId,
        });
      } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e, null, 2));
      }
    }),
});

const appRouter = t.router({
  tasks: tasksRouter,
  auth: authenticationRouter,
});

export type AppRouter = typeof appRouter;

export const onRequest: PagesFunction<Env> = tRPCPlugin<Env>({
  router: appRouter,
  endpoint: "/api/trpc",
  createContext,
});
