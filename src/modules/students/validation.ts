
import { z } from "zod";


const studentDetailsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "Last name is required"),

  dateOfBirth: z.iso.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]).optional(),

  genotype: z.enum([
    "AA",
    "AS",
    "SS",
    "AC",
    "SC",
    "OTHER",
  ]).optional(),
});

const newParentSchema = z.object({
  firstName: z.string().trim().min(1, "Parent first name is required"),
  lastName: z.string().trim().min(1, "Parent last name is required"),
  relationship: z.enum([
    "PARENT",
    "GUARDIAN",
    "FATHER",
    "MOTHER",
  ]),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Parent phone number is required"),
  homeAddress: z.string().trim().optional(),
  workAddress: z.string().trim().optional(),
  workPhone: z.string().trim().optional(),
});

const parentSelectionSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("existing"),
    parentId: z.string().min(1, "Select a parent"),
  }),
  z.object({
    mode: z.literal("new"),
    details: newParentSchema,
  }),
]);

const classEnrolmentSchema = z.object({
  classId: z.string().min(1, "Select a class"),
  sessionId: z.string().min(1, "Select an academic session"),
});

export const createStudentSchema = z.strictObject({
  student: studentDetailsSchema,
  parent: parentSelectionSchema,
  enrolment: classEnrolmentSchema,
});

export type CreateStudentInput = z.infer<
  typeof createStudentSchema
>;