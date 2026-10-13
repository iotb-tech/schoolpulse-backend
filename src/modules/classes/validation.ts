
import { z } from "zod";

export const createClassSchema = z.strictObject({
  name: z.string().trim().min(1, "Class name is required"),
  section: z.string().trim().min(1, "Section cannot be empty").optional(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
