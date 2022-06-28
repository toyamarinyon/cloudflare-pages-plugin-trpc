import tRPCPlugin from "../../../dist/index";
import * as trpc from "@trpc/server";
import { Context, createContext } from "../../context";
import { z } from "zod";

let id = 0;

const db = {
  posts: [
    {
      id: ++id,
      title: "hello",
    },
  ],
};

function createRouter() {
  return trpc.router<Context>();
}

const posts = createRouter()
  .mutation("create", {
    input: z.object({
      title: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const post = {
        id: ++id,
        ...input,
      };
      await ctx.session.save({
        userId: 123,
      });
      db.posts.push(post);
      return post;
    },
  })
  .query("list", {
    resolve: () => db.posts,
  });

export const appRouter = createRouter()
  .query("hello", {
    input: z.string().nullish(),
    resolve: ({ input }) => {
      return `hello ${input ?? "world"}`;
    },
  })
  .merge("post.", posts);

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
    createContext,
    endpoint: "/api/trpc",
  })(context);
};
