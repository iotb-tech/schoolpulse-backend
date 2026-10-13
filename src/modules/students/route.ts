
import { Router } from "express";
import { createStudentController } from "./controller.js";

const studentRouter = Router();

studentRouter.post("/", createStudentController);

export default studentRouter;