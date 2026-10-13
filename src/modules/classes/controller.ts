
import type { Request, Response, NextFunction } from "express";
import { createClassSchema } from "./validation.js";
import { createClass } from "./service.js";

export async function createClassController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createClassSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      status: "error",
      message: "Invalid class data",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const schoolClass = await createClass(result.data);

    res.status(201).json({
      status: "success",
      message: "Class created successfully",
      data: schoolClass,
    });
  } catch (error) {
    next(error);
  }
}
