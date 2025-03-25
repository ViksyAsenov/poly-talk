import { Router } from "express";
import { getGoogleLoginUrl, handleGoogleCallback, logout } from "@controllers/auth";
import { isAuth, isNotAuth } from "@middlewares/auth";

const router = Router();

router.get("/google", isNotAuth, getGoogleLoginUrl);

router.get("/google/callback", isNotAuth, handleGoogleCallback);

router.post("/logout", isAuth, logout);

export default router;
