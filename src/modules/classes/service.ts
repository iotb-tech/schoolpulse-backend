
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../config/prisma.js";
import AppError from "../../utils/app-error.js";
import type { CreateClassInput } from "./validation.js";

export async function createClass(input: CreateClassInput) {
  try {
    const name = input.name.trim();
    const section = input.section?.trim() || null;

    // Prevent duplicate class names when no section is provided.
    if (section === null) {
      const existingClass = await prisma.class.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
          section: null,
        },
      });

      if (existingClass) {
        throw new AppError(
          "A class with this name and no section already exists.",
          409,
        );
      }
    }

    return await prisma.class.create({
      data: {
        name,
        section,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError(
          "A class with this name and section already exists.",
          409,
        );
      }
    }

    throw error;
  }
}
