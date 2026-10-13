
import { Router } from "express";
import { createClassController } from "./controller.js";

const classRouter = Router();

classRouter.post("/", createClassController);

export default classRouter;
