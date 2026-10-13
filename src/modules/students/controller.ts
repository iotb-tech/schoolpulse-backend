
import type { Request, Response, NextFunction } from "express";
import { createStudentSchema } from "./validation.js";
import { createStudent } from "./service.js";

export async function createStudentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = createStudentSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      status: "error",
      message: "Invalid student registration data",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const student = await createStudent(result.data);

    res.status(201).json({
      status: "success",
      message: "Student registered successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}