
import { z } from "zod";

export const createClassSchema = z.strictObject({
  name: z.string().trim().min(1, "Class name is required"),
  section: z.string().trim().min(1, "Section cannot be empty").optional(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;



export const updateClassSchema = z
  .strictObject({
    name: z.string().trim().min(1, "Class name cannot be empty").optional(),
    section: z
      .string()
      .trim()
      .min(1, "Section cannot be empty")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.section !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  );

export type UpdateClassInput = z.infer<typeof updateClassSchema>;
