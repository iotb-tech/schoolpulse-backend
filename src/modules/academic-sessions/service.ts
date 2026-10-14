
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../config/prisma.js";
import AppError from "../../utils/app-error.js";
import type { CreateAcademicSessionInput } from "./validation.js";

export async function createAcademicSession(
  input: CreateAcademicSessionInput,
) {
  try {
    const startDate = new Date(`${input.startDate}T00:00:00.000Z`);
    const endDate = new Date(`${input.endDate}T23:59:59.999Z`);
    const isCurrent = input.isCurrent ?? false;

    return await prisma.$transaction(async (tx) => {
      // Prevent overlapping academic sessions.
      const overlappingSession = await tx.academicSession.findFirst({
        where: {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      });

      if (overlappingSession) {
        throw new AppError(
          "The academic session dates overlap an existing session.",
          409,
        );
      }

      // Ensure only one session is marked as current.
      if (isCurrent) {
        await tx.academicSession.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }

      return await tx.academicSession.create({
        data: {
          name: input.name,
          startDate,
          endDate,
          isCurrent,
        },
      });
    }, {
      maxWait: 10_000,
      timeout: 20_000,
    }); 
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError(
          "An academic session with this name already exists.",
          409,
        );
      }
    }

    throw error;
  }
}
