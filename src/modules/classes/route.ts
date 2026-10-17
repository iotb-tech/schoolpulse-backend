
import { Router } from "express";
import { createClassController, getClassByIdController, getClassesController } from "./controller.js";

const classRouter = Router();

classRouter.post("/", createClassController);
classRouter.get("/", getClassesController);
classRouter.get("/:id", getClassByIdController);
    
export default classRouter;
 


