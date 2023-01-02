import { z } from "zod";

export const sessionScheme = z.object({
  id: z.string(),
});
