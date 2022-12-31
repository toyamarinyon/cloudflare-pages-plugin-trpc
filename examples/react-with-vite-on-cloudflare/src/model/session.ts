import { z } from "zod";

export const sessionScheme = z.object({
  userId: z.number(),
});
