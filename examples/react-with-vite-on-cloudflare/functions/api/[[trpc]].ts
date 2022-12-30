import { initTRPC } from "@trpc/server";
import tRPCPlugin, { CloudflareEnv } from "cloudflare-pages-plugin-trpc";
import { createTaskScheme, Task } from "../../src/model/task";

export interface Env {
  DB: D1Database;
}

const t = initTRPC.context<CloudflareEnv<Env>>().create();

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
  list: t.procedure.query(async ({ ctx }) => {
    const { results: tasks } = await ctx.env.DB.prepare(
      "SELECT * FROM tasks"
    ).all<Task>();
    return {
      tasks,
    };
  }),
});

const appRouter = t.router({
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;

export const onRequest: PagesFunction<Env> = tRPCPlugin({
  router: appRouter,
  endpoint: "/api/trpc",
});
