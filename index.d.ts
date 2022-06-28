import type { FetchHandlerRequestOptions } from "@trpc/server/adapters/fetch";
import type { AnyRouter } from "@trpc/server";
import type { AnyZodObject } from "zod";

interface PluginOption {
  session?:
    | {
        cookie?: string | null | undefined;
        password: string;
        scheme: AnyZodObject;
      }
    | null
    | undefined;
}
export type PluginArgs = Omit<
  FetchHandlerRequestOptions<AnyRouter>,
  "req"
> &
  PluginOption;

export default function tRPCPagesPluginFunction(
  args: PluginArgs
): PagesFunction;
