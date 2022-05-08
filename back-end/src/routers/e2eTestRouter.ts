import { Router } from "express";
import e2eTestControler from "../controllers/e2eTestControler.js";

const e2eTestsRouter = Router(); 
e2eTestsRouter.post("/reset", e2eTestControler.reset);

export default e2eTestsRouter;