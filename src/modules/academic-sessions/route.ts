
import { Router } from "express";
import { createAcademicSessionController } from "./controller.js";

const academicSessionRouter = Router();

academicSessionRouter.post("/", createAcademicSessionController);

export default academicSessionRouter;
