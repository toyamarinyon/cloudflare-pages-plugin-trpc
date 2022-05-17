# tRPC Pages Plugin

This plugin allows developers to create tRPC server on Cloudflare Page Function rapidly.

# READ THIS FIRST

This plugin is on `tRPC@10.x`. It's still in alpha, expect bugs and there're lots of breaking changes.

But I am believing that Cloudflare + tRPC could quite change web development.

## How to use

If you have any tRPC router, just set it into this plugin!

For example, you have router as like as below:

```ts
// router.ts
import * as trpc from "@trpc/server";

export const router = trpc.router().query("hello", {
  input: z.string().nullish(),
  resolve: ({ input }) => {
    return `hello ${input ?? "world"}`;
  },
});
export type AppRouter = typeof appRouter;
```

You can deploy it to Cloudflare Pages Function right now.

```ts
import { router } from "./router.ts";
import tRPCPlugin from 'cloudflare-pages-plugin';

// That's it!
export const onRequest: PagesFunction = tRPCPlugin({ router });
```

## What is tRPC ?

tRPC is library that allows End-to-end typesafe APIs made easy. There are many resource to explain tRPC concept, history and what it try to resolve, but I highly recommend that you try to [quick demo](https://sat0shi.dev/posts/trpc-hands-on) first.

Of course, you can see tRPC document on [trpc.io](https://trpc.io/).

## Why this plugin provide as individual package ?

I've sometimes contributed tRPC, and I also created a [pull request](https://github.com/trpc/trpc/pull/1882) that this plugin into tRPC package.

I discussed @KATT who creator of tRPC and @sachinraja who maintainer of tRPC, and result, it's prefer to provide as individual package.

So, I'll continue to actively follow and maintain tRPC updates.

## Road map

### High

- Write documents

    - deploy guide

- Integrate Cloudflare resources

    - R2
    - D1
    - And more...

### Middle

- Testing

  I'm considering how test it.
