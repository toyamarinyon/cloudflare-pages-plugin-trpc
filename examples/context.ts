import * as trpc from "@trpc/server";
import { getWebCryptSession } from "webcrypt-session/adapters/trpc";
import { z } from "zod";

const sessionScheme = z.object({
  userId: z.number(),
});
export async function createContext(opts: { req: Request }) {
  const session = await getWebCryptSession(sessionScheme, opts.req, {
    password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%",
  });
  return { session };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>
