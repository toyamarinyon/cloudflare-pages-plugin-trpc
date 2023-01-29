import { expect, test } from "vitest";
import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import { onRequest } from "./[[path]]";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

const createContext = function (opts: FetchCreateContextFnOptions) {
  return {};
};
export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `hello ${input ?? "world"}`;
  }),
});

const requestHandlerMock = {
  waitUntil: () => Promise.resolve(),
  functionPath: "[[path]]",
  next: async () => new Response(undefined),
  env: {
    ASSETS: { fetch: async () => new Response(undefined) },
  },
  params: {},
  data: {},
};
test("be able to response", async () => {
  const response = await onRequest({
    ...requestHandlerMock,
    request: new Request("http://localhost:8989/api/trpc/hello"),
    pluginArgs: {
      router: appRouter,
      endpoint: "/api/trpc",
    },
  });
  expect(response.status).toBe(200);
});
test("be able to response if args include createContext", async () => {
  const response = await onRequest({
    ...requestHandlerMock,
    request: new Request("http://localhost:8989/api/trpc/hello"),
    pluginArgs: {
      router: appRouter,
      endpoint: "/api/trpc",
      createContext,
    },
  });
  expect(response.status).toBe(200);
});
