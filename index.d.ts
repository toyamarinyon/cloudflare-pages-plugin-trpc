import type { FetchHandlerRequestOptions } from "@trpc/server/adapters/fetch";
import type { AnyRouter, inferAsyncReturnType } from "@trpc/server";

export type CloudflareEnv<Env> = { env: Env };
export type inferAsyncReturnTypeWithCloudflareEnv<
  Env,
  TFunction extends (...args: any) => any
> = inferAsyncReturnType<TFunction> & CloudflareEnv<Env>;

export type PluginArgs = Omit<FetchHandlerRequestOptions<AnyRouter>, "req">;

export default function tRPCPagesPluginFunction(
  args: PluginArgs
): PagesFunction;
