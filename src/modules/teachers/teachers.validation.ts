import type { Request } from "express";

export class ValidationError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function bodyObject(req: Request): Record<string, unknown> {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new ValidationError("Request body must be a JSON object.");
  }
  return req.body as Record<string, unknown>;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(
      `${field} is required and must be a non-empty string.`,
    );
  }
  return value.trim();
}

function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`);
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

export interface CreateTeacherInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export function parseCreateTeacher(req: Request): CreateTeacherInput {
  const body = bodyObject(req);
  const firstName = requiredString(body.firstName, "firstName");
  const lastName = requiredString(body.lastName, "lastName");
  const email = optionalString(body.email, "email");
  const phone = optionalString(body.phone, "phone");

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("email must be a valid email address.");
  }

  return {
    firstName,
    lastName,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
  };
}

export interface CreateAssignmentInput {
  classId: string;
  sessionId: string;
}

export function parseCreateAssignment(req: Request): CreateAssignmentInput {
  const body = bodyObject(req);
  return {
    classId: requiredString(body.classId, "classId"),
    sessionId: requiredString(body.sessionId, "sessionId"),
  };
}

export interface UpdateTeacherInput {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
}

export function parseUpdateTeacher(req: Request): UpdateTeacherInput {
  const body = bodyObject(req);
  const allowed = ["firstName", "lastName", "email", "phone", "isActive"];
  const unknown = Object.keys(body).filter((key) => !allowed.includes(key));
  if (unknown.length)
    throw new ValidationError(`Unsupported field(s): ${unknown.join(", ")}.`);
  if (!Object.keys(body).length)
    throw new ValidationError("Provide at least one field to update.");

  const result: UpdateTeacherInput = {};
  if (body.firstName !== undefined)
    result.firstName = requiredString(body.firstName, "firstName");
  if (body.lastName !== undefined)
    result.lastName = requiredString(body.lastName, "lastName");
  if (body.email !== undefined) {
    if (body.email === null || body.email === "") result.email = null;
    else {
      const email = requiredString(body.email, "email");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new ValidationError("email must be a valid email address.");
      result.email = email;
    }
  }
  if (body.phone !== undefined)
    result.phone =
      body.phone === null || body.phone === ""
        ? null
        : requiredString(body.phone, "phone");
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== "boolean")
      throw new ValidationError("isActive must be a boolean.");
    result.isActive = body.isActive;
  }
  return result;
}
