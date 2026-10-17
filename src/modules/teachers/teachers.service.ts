import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../config/prisma.js";
import type {
  CreateAssignmentInput,
  CreateTeacherInput,
  UpdateTeacherInput,
} from "./teachers.validation.js";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const isPrismaCode = (error: unknown, code: string): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

// PostgreSQL/Prisma can abort serializable transactions when concurrent writes conflict.
// Retry the whole transaction, not just the final write.
async function serializableRetry<T>(
  work: () => Promise<T>,
  attempts = 4,
): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      if (isPrismaCode(error, "P2034") && attempt < attempts) continue;
      if (isPrismaCode(error, "P2034")) {
        throw new ApiError(
          409,
          "Concurrent update detected. Please retry the request.",
        );
      }
      throw error;
    }
  }
}

export async function createTeacher(input: CreateTeacherInput) {
  try {
    return await serializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const sequence = await (tx as any).idSequence.upsert({
            where: { name: "teacher" },
            create: { name: "teacher", value: 1 },
            update: { value: { increment: 1 } },
          });
          const id = `TCH-${String(sequence.value).padStart(4, "0")}`;
          return (tx as any).teacher.create({ data: { id, ...input } });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch (error) {
    if (isPrismaCode(error, "P2002"))
      throw new ApiError(
        409,
        "A teacher with this email or generated ID already exists.",
      );
    throw error;
  }
}

export async function listTeachers(search?: string, status?: string) {
  if (status && !["ACTIVE", "INACTIVE"].includes(status.toUpperCase())) {
    throw new ApiError(400, "status must be ACTIVE or INACTIVE.");
  }
  const term = search?.trim();
  return (prisma as any).teacher.findMany({
    where: {
      ...(status ? { isActive: status.toUpperCase() === "ACTIVE" } : {}),
      ...(term
        ? {
            OR: [
              { id: { contains: term, mode: "insensitive" } },
              { firstName: { contains: term, mode: "insensitive" } },
              { lastName: { contains: term, mode: "insensitive" } },
              { email: { contains: term, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      assignments: {
        orderBy: { assignedAt: "desc" },
        include: { class: true, session: true },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

export async function getTeacher(id: string) {
  const teacher = await (prisma as any).teacher.findUnique({
    where: { id },
    include: {
      assignments: {
        orderBy: { assignedAt: "desc" },
        include: { class: true, session: true },
      },
    },
  });
  if (!teacher) throw new ApiError(404, "Teacher not found.");
  return teacher;
}

export async function updateTeacher(id: string, input: UpdateTeacherInput) {
  try {
    return await (prisma as any).teacher.update({ where: { id }, data: input });
  } catch (error) {
    if (isPrismaCode(error, "P2025"))
      throw new ApiError(404, "Teacher not found.");
    if (isPrismaCode(error, "P2002"))
      throw new ApiError(409, "A teacher with this email already exists.");
    throw error;
  }
}

export async function createAssignment(
  teacherId: string,
  input: CreateAssignmentInput,
) {
  try {
    return await serializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const [teacher, schoolClass, session] = await Promise.all([
            (tx as any).teacher.findUnique({ where: { id: teacherId } }),
            (tx as any).schoolClass.findUnique({
              where: { id: input.classId },
            }),
            (tx as any).session.findUnique({ where: { id: input.sessionId } }),
          ]);

          if (!teacher) throw new ApiError(404, "Teacher not found.");
          if (!schoolClass) throw new ApiError(404, "Class not found.");
          if (!session) throw new ApiError(404, "Session not found.");
          if (!teacher.isActive)
            throw new ApiError(400, "Cannot assign an inactive teacher.");
          if (!schoolClass.isActive)
            throw new ApiError(
              400,
              "Cannot assign a teacher to an inactive class.",
            );
          if (!session.isActive)
            throw new ApiError(
              400,
              "Cannot assign a teacher to an inactive session.",
            );

          const [activeClassAssignment, activeTeacherAssignments] =
            await Promise.all([
              (tx as any).teacherAssignment.findFirst({
                where: { classId: input.classId, endedAt: null },
              }),
              (tx as any).teacherAssignment.count({
                where: { teacherId, endedAt: null },
              }),
            ]);

          if (activeClassAssignment)
            throw new ApiError(
              409,
              "This class already has an active teacher.",
            );
          if (activeTeacherAssignments >= 3)
            throw new ApiError(
              409,
              "A teacher cannot have more than three active class assignments.",
            );

          return (tx as any).teacherAssignment.create({
            data: {
              teacherId,
              classId: input.classId,
              sessionId: input.sessionId,
            },
            include: { teacher: true, class: true, session: true },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isPrismaCode(error, "P2002"))
      throw new ApiError(409, "This class already has an active teacher.");
    throw error;
  }
}

export async function endAssignment(teacherId: string, assignmentId: string) {
  return serializableRetry(() =>
    prisma.$transaction(
      async (tx) => {
        const assignment = await (tx as any).teacherAssignment.findUnique({
          where: { id: assignmentId },
        });
        if (!assignment || assignment.teacherId !== teacherId)
          throw new ApiError(404, "Assignment not found for this teacher.");
        if (assignment.endedAt)
          throw new ApiError(409, "This assignment has already ended.");

        // Conditional update prevents two callers from ending the same assignment concurrently.
        const updated = await (tx as any).teacherAssignment.updateMany({
          where: { id: assignmentId, teacherId, endedAt: null },
          data: { endedAt: new Date() },
        });
        if (updated.count !== 1)
          throw new ApiError(409, "This assignment is no longer active.");
        return (tx as any).teacherAssignment.findUniqueOrThrow({
          where: { id: assignmentId },
          include: { teacher: true, class: true, session: true },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    ),
  );
}
