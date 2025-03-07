import { Router } from "express";
import { isAuth } from "@middlewares/auth";

const router = Router();

router.get("/", isAuth);

export default router;
