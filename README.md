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

## What is tRPC ?

tRPC is library that allows End-to-end typesafe APIs made easy. There are many resource to explain tRPC concept, history and what it try to resolve, but I highly recommend that you try to [quick demo](https://sat0shi.dev/posts/trpc-hands-on) first.

Of course, you can see tRPC document on [trpc.io](https://trpc.io/).

# Why this plugin provide as individual package ?

I've sometimes contributed tRPC, so I also created a [pull request](https://github.com/trpc/trpc/pull/1882) that this plugin into tRPC package, and I discussed @KATT who creator of tRPC and @sachinraja who maintainer of tRPC, and result, it's prefer to provide as individual package.

So, I'll continue to actively follow and maintain tRPC updates.

# Road map

## High

- Write documents

  - deploy guide

- Integrate Cloudflare resources

  - R2
  - D1
  - And more...

## Middle

- Testing

  I'm considering how test it.
