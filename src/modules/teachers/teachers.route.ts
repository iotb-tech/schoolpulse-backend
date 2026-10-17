import { Router } from "express";
import * as controller from "./teachers.controller.js";

const teachersRouter = Router();

teachersRouter.post("/", controller.createTeacher);
teachersRouter.get("/", controller.listTeachers);
teachersRouter.get("/:id", controller.getTeacher);
teachersRouter.patch("/:id", controller.updateTeacher);
teachersRouter.post("/:id/assignments", controller.createAssignment);
teachersRouter.patch(
  "/:id/assignments/:assignmentId/end",
  controller.endAssignment,
);

export default teachersRouter;
