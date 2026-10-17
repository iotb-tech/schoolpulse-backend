import type { NextFunction, Request, Response } from "express";
import * as teachersService from "./teachers.service.js";
import {
  parseCreateAssignment,
  parseCreateTeacher,
  parseUpdateTeacher,
} from "./teachers.validation.js";

export async function createTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const teacher = await teachersService.createTeacher(
      parseCreateTeacher(req),
    );
    res.status(201).json({ status: "success", data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function listTeachers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const teachers = await teachersService.listTeachers(search, status);
    res
      .status(200)
      .json({ status: "success", count: teachers.length, data: teachers });
  } catch (error) {
    next(error);
  }
}

export async function getTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const teacher = await teachersService.getTeacher(String(req.params.id));
    res.status(200).json({ status: "success", data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const teacher = await teachersService.updateTeacher(
      String(req.params.id),
      parseUpdateTeacher(req),
    );
    res.status(200).json({ status: "success", data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const assignment = await teachersService.createAssignment(
      String(req.params.id),
      parseCreateAssignment(req),
    );
    res.status(201).json({ status: "success", data: assignment });
  } catch (error) {
    next(error);
  }
}

export async function endAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const assignment = await teachersService.endAssignment(
      String(req.params.id),
      String(req.params.assignmentId),
    );
    res.status(200).json({ status: "success", data: assignment });
  } catch (error) {
    next(error);
  }
}
