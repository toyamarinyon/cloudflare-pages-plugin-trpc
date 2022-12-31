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
  auth: t.procedure.query(async ({ ctx }) => {
    if (ctx.session.userId == null) {
      return;
    }
    /**
     * todo: check if user exists
     */
    return true;
  }),
  login: t.procedure
    .input(z.object({ oauthToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const accessToken = await getAccessToken(input.oauthToken);
        const user = await getUser(accessToken);

        /**
         * todo: check if user exists
         **/
        await ctx.session.save({
          userId: 1,
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
