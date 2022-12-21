// utils/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../functions/api/[[trpc]]";

export const trpc = createTRPCReact<AppRouter>();
