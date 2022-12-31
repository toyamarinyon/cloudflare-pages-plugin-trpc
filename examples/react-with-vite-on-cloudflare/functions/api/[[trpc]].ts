import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import tRPCPlugin, {
  inferAsyncReturnTypeWithCloudflareEnv,
} from "cloudflare-pages-plugin-trpc";
import { getWebCryptSession } from "webcrypt-session/adapters/trpc";
import { z } from "zod";
import { getAccessToken, getUser } from "../../src/model/github";
import { sessionScheme } from "../../src/model/session";
import { createTaskScheme, Task, taskScheme } from "../../src/model/task";

export interface Env {
  DB: D1Database;
}
const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const session = await getWebCryptSession(sessionScheme, req, {
    password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  });
  return { session };
};
type Context = inferAsyncReturnTypeWithCloudflareEnv<Env, typeof createContext>;
const t = initTRPC.context<Context>().create();

const tasksRouter = t.router({
  create: t.procedure
    .input(createTaskScheme)
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.env.DB.prepare(
        "INSERT INTO tasks (title, description) VALUES (?, ?)"
      )
        .bind(input.title, input.description)
        .run<Task>();

      if (!result.success) {
        throw new Error(result.error);
      }
    }),
  complete: t.procedure
    .input(taskScheme.pick({ id: true }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.env.DB.prepare(
        "UPDATE tasks SET completion_datetime = ? WHERE id = ?"
      )
        .bind(new Date().valueOf(), input.id)
        .run<Task>();

      if (!result.success) {
        throw new Error(result.error);
      }
    }),
  list: t.procedure.query(async ({ ctx }) => {
    const { results: tasks } = await ctx.env.DB.prepare(
      "SELECT * FROM tasks where completion_datetime IS NULL"
    ).all<Task>();
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
    const session = await ctx.env.DB.prepare(
      "SELECT id, user_id FROM sessions WHERE id = ?"
    )
      .bind(ctx.session.id)
      .first<{ id: number; user_id: number }>();
    if (session == null) {
      return { currentUser: null };
    }

    const user = await ctx.env.DB.prepare("SELECT * FROM users WHERE id = ?")
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
        const accessToken = await getAccessToken(input.oauthToken);
        const githubUser = await getUser(accessToken);

        const dbUser = await ctx.env.DB.prepare(
          "SELECT id FROM users WHERE github_user_id = ?"
        )
          .bind(githubUser.id)
          .first<{ id: number }>();

        /**
         * @todo use const
         */
        let dbUserId = 0;
        if (dbUser == null) {
          await ctx.env.DB.prepare(
            "INSERT INTO users (github_user_id, github_oauth_token) VALUES (?, ?)"
          )
            .bind(githubUser.id, accessToken)
            .run();
          const { id } = await ctx.env.DB.prepare(
            "SELECT last_insert_rowid() as id"
          ).first<{ id: number }>();
          dbUserId = id;
        } else {
          dbUserId = dbUser.id;
          await ctx.env.DB.prepare(
            "UPDATE users SET github_oauth_token = ? WHERE id = ?"
          )
            .bind(accessToken, dbUser.id)
            .run();
        }
        const sessionId = crypto.randomUUID();
        await ctx.env.DB.prepare(
          "INSERT INTO sessions (id, user_id) VALUES (?, ?)"
        )
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

export const onRequest: PagesFunction<Env> = tRPCPlugin({
  router: appRouter,
  endpoint: "/api/trpc",
  createContext,
});
