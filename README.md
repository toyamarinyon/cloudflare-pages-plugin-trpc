# tRPC Pages Plugin

This plugin allows developers to create tRPC server on Cloudflare Page Function rapidly.

You can see demo site on [https://cloudflare-pages-plugin-trpc.pages.dev](https://cloudflare-pages-plugin-trpc.pages.dev/).

# How to use

If you have any tRPC router, just set it into this plugin!

For example, you have router as like as below:

```ts
// router.ts
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.query(() => "world"),
});

export type AppRouter = typeof appRouter;
```

You can deploy it to Cloudflare Pages Function right now.

```ts
import { router } from "./router.ts";
import tRPCPlugin from "cloudflare-pages-plugin";

// That's it!
export const onRequest: PagesFunction = tRPCPlugin({ router });
```

More practical code deployed to the [demo site](https://cloudflare-pages-plugin-trpc.pages.dev) can be found in the [/examples](https://github.com/toyamarinyon/cloudflare-pages-plugin-trpc/tree/main/examples) folder.

## Interact with resources on the Workers platform

Cloudflare has provided bindings to allow your Workers to interact with resources on the Workers' platform.

And this plugin allows you to interact with any resources on the Workers platform from the tRPC context with only writing a bit of code.

For example, if you write the below code, then you can use Cloudflare D1 from the tRPC context:

```ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import tRPCPlugin, { CloudflareEnv } from "cloudflare-pages-plugin-trpc";

// Define binding to allow your worker to interact with Cloudflare D1.
export interface Env {
  DB: D1Database;
}

// Explicit the binding to the tRPC context with `CloudflareEnv` type helper.
const t = initTRPC.context<CloudflareEnv<Env>>().create();

const posts = t.router({
  create: t.procedure
    .input(z.object({ title: z.string(), body: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // You can use Cloudflare D1 from the tRPC context!!
      const result = await ctx.env.DB.prepare(
        "INSERT INTO posts (title, body) VALUES (?, ?)"
      )
        .bind(input.title, input.body)
        .run();

      if (!result.success) {
        throw new Error(result.error);
      }
    }),
  list: t.procedure.query(async ({ ctx }) => {
    const { results: posts } = await ctx.env.DB.prepare(
      "SELECT * FROM posts"
    ).all();
    return {
      posts,
    };
  }),
});

const appRouter = t.router({
  posts,
});

export const onRequest: PagesFunction<Env> = tRPCPlugin({
  router: appRouter,
  endpoint: "/api/trpc",
});
```


# What is tRPC ?

tRPC is library that allows End-to-end typesafe APIs made easy. There are many resource to explain tRPC concept, history and what it try to resolve, but I highly recommend that you try to [quick demo](https://sat0shi.dev/posts/trpc-hands-on) first.

Of course, you can see tRPC document on [trpc.io](https://trpc.io/).

# Why this plugin provide as individual package ?

I've sometimes contributed tRPC, so I also created a [pull request](https://github.com/trpc/trpc/pull/1882) that this plugin into tRPC package, and I discussed @KATT who creator of tRPC and @sachinraja who maintainer of tRPC, and result, it's prefer to provide as individual package.

So, I'll continue to actively follow and maintain tRPC updates.

# Road map

## High

- Write documents

  - deploy guide

## Middle

- Testing

  I'm considering how test it.
