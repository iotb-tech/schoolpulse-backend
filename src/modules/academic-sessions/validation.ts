
import { z } from "zod";

export const createAcademicSessionSchema = z
  .strictObject({
    name: z.string().trim().min(1, "Academic session name is required"),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    isCurrent: z.boolean().optional(),
  })
  .refine(
    (data) => data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type CreateAcademicSessionInput = z.infer<
  typeof createAcademicSessionSchema
>;
