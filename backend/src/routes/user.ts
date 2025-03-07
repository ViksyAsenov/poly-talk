import { Router } from "express";
import { isAuth } from "@middlewares/auth";
import { getMinUser, updateUser } from "@controllers/user";

const router = Router();

router.get("/me", isAuth, getMinUser);

router.patch("/me", isAuth, updateUser);

export default router;
