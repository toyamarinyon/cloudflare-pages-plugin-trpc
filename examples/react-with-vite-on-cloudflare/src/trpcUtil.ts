// utils/trpc.ts
import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import type { AppRouter } from "../functions/api/[[trpc]]";

export const trpc = createTRPCReact<AppRouter>();
export const links = [
  httpBatchLink({
    url: `${window.location.protocol}//${window.location.host}/api/trpc`,
  }),
];
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links,
});
