
import type { Request, Response, NextFunction } from "express";
import { createAcademicSessionSchema } from "./validation.js";
import { createAcademicSession } from "./service.js";

export async function createAcademicSessionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createAcademicSessionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      status: "error",
      message: "Invalid academic session data",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const session = await createAcademicSession(result.data);

    res.status(201).json({
      status: "success",
      message: "Academic session created successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
}
