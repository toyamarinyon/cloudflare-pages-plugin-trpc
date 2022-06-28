import { expect, test, vi } from "vitest";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { onRequest } from "./[[path]]";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { inferAsyncReturnType } from "@trpc/server";
import { WebCryptSession } from "webcrypt-session";

const createContext = function (opts: FetchCreateContextFnOptions) {
  return {};
};
export type Context = inferAsyncReturnType<typeof createContext>;

const sessionScheme = z.object({
  userId: z.number(),
});
const createRouter = function () {
  return trpc.router<Context & WebCryptSession<typeof sessionScheme>>();
};

const appRouter = createRouter().query("hello", {
  input: z.string().nullish(),
  resolve: ({ input, ctx }) => {
    return `hello ${input ?? "world"}`;
  },
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
test("works properly", async () => {
  const response = await onRequest({
    ...requestHandlerMock,
    request: new Request("http://localhost:8989/api/trpc/hello"),
    pluginArgs: {
      router: appRouter,
      endpoint: "/api/trpc",
    },
  });
  expect(response.status).toBe(200);
  expect(response.headers.get("Set-Cookie")).toBeNull();
});

test("works properly with session", async () => {
  const mock = vi.fn().mockImplementation(() => ["Set-Cookie", "session"]);
  const response = await onRequest({
    ...requestHandlerMock,
    request: new Request("http://localhost:8989/api/trpc/hello"),
    pluginArgs: {
      router: appRouter,
      endpoint: "/api/trpc",
      createContext: () => {
        return {
          session: {
            responseHeader: mock,
          },
        };
      },
      session: {
        scheme: sessionScheme,
        password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
      },
    },
  });
  expect(mock).toBeCalledTimes(1)
  expect(response.status).toBe(200); 
  expect(response.headers.get("Set-Cookie")).toBe("session");
});
