import { z } from "zod";

export const taskScheme = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});
export type Task = z.infer<typeof taskScheme>;
export const createTaskScheme = taskScheme.omit({ id: true });
export type CreateTaskPayload = z.infer<typeof createTaskScheme>;
