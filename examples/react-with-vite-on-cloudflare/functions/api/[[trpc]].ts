import { initTRPC } from "@trpc/server";
import { z } from "zod";
import tRPCPlugin from "cloudflare-pages-plugin-trpc";

const t = initTRPC.create();

const posts = t.router({
  create: t.procedure
    .input(z.object({ title: z.string() }))
    .mutation(({ input }) => {
      return {
        id: 1,
        title: input.title,
      };
    }),
  list: t.procedure.query(() => ({
    posts: [
      { id: 1, title: "hello" },
      { id: 2, title: "world" },
    ],
  })),
});

const appRouter = t.router({
  posts,
});

export type AppRouter = typeof appRouter;

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}
// declare type PagesFunction<
//   Env = unknown,
//   Params extends string = any,
//   Data extends Record<string, unknown> = Record<string, unknown>
// > = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;
export const onRequest: PagesFunction<Env> = async (context) => {
  return tRPCPlugin({
    router: appRouter,
    endpoint: "/api/trpc",
  })(context);
};
