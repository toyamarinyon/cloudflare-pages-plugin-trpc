// utils/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs } from "@trpc/server";
import type { AppRouter } from "../functions/api/[[trpc]]";

export const trpc = createTRPCReact<AppRouter>();

export type RouterInput = inferRouterInputs<AppRouter>;
