import { z } from "zod";

export const taskScheme = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  completion_datetime: z.number().optional(),
});
export type Task = z.infer<typeof taskScheme>;
export const createTaskScheme = taskScheme.omit({
  id: true,
  completion_datetime: true,
});
export type CreateTaskPayload = z.infer<typeof createTaskScheme>;
