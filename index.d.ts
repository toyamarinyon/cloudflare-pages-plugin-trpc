import type { FetchHandlerRequestOptions } from "@trpc/server/adapters/fetch";
import type { AnyRouter, inferRouterContext } from "@trpc/server";

export type FetchCreateContextWithCloudflareEnvFnOptions<Env> = {
  req: Request;
  env: Env;
};

type FetchCreateContextWithCloudflareEnvFn<TRouter extends AnyRouter, Env> = (
  opts: FetchCreateContextWithCloudflareEnvFnOptions<Env>
) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;

export type PluginArgs<Env> = Omit<
  FetchHandlerRequestOptions<AnyRouter>,
  "req" | "createContext"
> & {
  createContext: FetchCreateContextWithCloudflareEnvFn<AnyRouter, Env>;
};

export default function tRPCPagesPluginFunction<Env>(
  args: PluginArgs<Env>
): PagesFunction;
