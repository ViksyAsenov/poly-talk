import { getLanguages } from "@controllers/language";
import { Router } from "express";

const router = Router();

router.get("/", getLanguages);

export default router;
