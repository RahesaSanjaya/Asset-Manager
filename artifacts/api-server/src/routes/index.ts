import { Router, type IRouter } from "express";
import healthRouter from "./health";
import soundsRouter from "./sounds";
import categoriesRouter from "./categories";

const router: IRouter = Router();

router.use(healthRouter);
router.use(soundsRouter);
router.use(categoriesRouter);

export default router;