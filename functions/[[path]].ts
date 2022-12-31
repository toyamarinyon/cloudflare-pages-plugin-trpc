import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import type { PluginArgs } from "..";

interface ResponseHeaderFn {
  responseHeader: () => [key: string, value: string];
}

function hasResponseHeader(
  object: unknown
): object is Record<string, unknown> & ResponseHeaderFn {
  return (
    typeof object === "object" &&
    object !== null &&
    "responseHeader" in object &&
    typeof (object as Record<string, unknown>).responseHeader === "function"
  );
}

type tRPCPagesPluginFunction<
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = PagesPluginFunction<Env, Params, Data, PluginArgs<Env>>;

export const onRequest: tRPCPagesPluginFunction = async ({
  pluginArgs,
  ...event
}) => {
  const { createContext, ...options } = pluginArgs;
  return fetchRequestHandler({
    ...options,
    endpoint: pluginArgs.endpoint,
    createContext: async ({ req }) =>
      await createContext({ req, env: event.env }),
    req: event.request,
    responseMeta: (ops) => {
      const meta = pluginArgs.responseMeta?.(ops) ?? {};
      const headers = meta?.headers ?? {};

      /**
       * Follows are for the `webcrypt-session/trpc`
       *
       * The `webcrypt-session/trpc` needs to set the cookie to response header but tRPC is
       * not aware of the cookie, so it must be set manually using the responseMeta option,
       * which is messy.
       *
       * Therefore, we have prepared a hidden function called `responseHeader` in the context
       * provided by `webcrypt-session/trpc`, which returns the cookie header.
       *
       * Then, if responseHeader exists in context, call it and set returns to header. It
       * allows session management using only getWebCryptSession provided by webcrypt-session/trpc.
       *
       * Of corse it is not only for the `webcrypt-session/trpc` but for any other plugin that.
       */
      for (const [_, value] of Object.entries(ops.ctx ?? {})) {
        if (hasResponseHeader(value)) {
          const [headerKey, headerValue] = value.responseHeader();
          headers[headerKey] = headerValue;
        }
      }
      return { ...meta, headers };
    },
  });
};
