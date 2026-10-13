import prisma from "../../config/prisma.js"
import { Prisma } from "../../generated/prisma/client.js";
import AppError from "../../utils/app-error.js";
import type { CreateStudentInput } from "./validation.js";

export async function createStudent(input: CreateStudentInput) {
  try {
  return await prisma.$transaction(async (tx) => {
    // 1. Generate sequential IDs safely inside the transaction.
    const nextId = async (sequenceName: string, prefix: string) => {
      const rows = await tx.$queryRaw<{ value: number }[]>`
        INSERT INTO "IdSequence" ("name", "value")
        VALUES (${sequenceName}, 1)
        ON CONFLICT ("name")
        DO UPDATE SET "value" = "IdSequence"."value" + 1
        RETURNING "value"
      `;

      return `${prefix}-${String(rows[0].value).padStart(4, "0")}`;
    };

    // 2. Verify the class exists and is active.
    const schoolClass = await tx.class.findUnique({
      where: { id: input.enrolment.classId },
    });

    if (!schoolClass || !schoolClass.isActive) {
      throw new AppError(
        "The selected class does not exist or is inactive.",
        404,
      );
    }

    // 3. Verify the academic session exists.
    const session = await tx.academicSession.findUnique({
      where: { id: input.enrolment.sessionId },
    });

    if (!session) {
      throw new AppError("The selected academic session does not exist.", 404);
    }

    // 4. Resolve the parent: reuse an existing record or create one.
    let parentId: string;

    if (input.parent.mode === "existing") {
      const parent = await tx.parent.findUnique({
        where: { parentId: input.parent.parentId },
      });

      if (!parent || !parent.isActive) {
        throw new AppError(
          "The selected parent does not exist or is inactive.",
          404,
        );
      }

      parentId = parent.id;
    } else {
      const details = input.parent.details;
      const email = details.email.trim().toLowerCase();

      const existingParent = await tx.parent.findUnique({
        where: { email },
      });

      if (existingParent) {
        // Reuse the record instead of creating a duplicate.
        const parent = existingParent.isActive
          ? existingParent
          : await tx.parent.update({
              where: { id: existingParent.id },
              data: { isActive: true },
            });

        parentId = parent.id;
      } else {
        const parentSchoolId = await nextId("parent", "PAR");

        const parent = await tx.parent.create({
          data: {
            parentId: parentSchoolId,
            firstName: details.firstName,
            lastName: details.lastName,
            relationship: details.relationship,
            email,
            phone: details.phone,
            homeAddress: details.homeAddress,
            workAddress: details.workAddress,
            workPhone: details.workPhone,
          },
        });

        parentId = parent.id;
      }
    }

    // 5. Generate the student-facing ID.
    const studentSchoolId = await nextId("student", "STU");

    // 6. Create the student and enrolment atomically.
    const student = await tx.student.create({
      data: {
        studentId: studentSchoolId,
        firstName: input.student.firstName,
        middleName: input.student.middleName,
        lastName: input.student.lastName,
        dateOfBirth: input.student.dateOfBirth
          ? new Date(input.student.dateOfBirth)
          : undefined,
        gender: input.student.gender,
        bloodGroup: input.student.bloodGroup,
        genotype: input.student.genotype,
        admissionDate: new Date(),
        parentId,
        enrollments: {
          create: {
            classId: schoolClass.id,
            sessionId: session.id,
          },
        },
      },
      include: {
        enrollments: {
          include: {
            class: true,
            session: true,
          },
        },
        parent: {
          select: {
            parentId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return student;
  });
  
} catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError(
          "A record with one of these unique values already exists.",
          409
        );
      }

      if (error.code === "P2025") {
        throw new AppError(
          "A related record could not be found.",
          404
        );
      }
    }

    throw error;
  }
}
