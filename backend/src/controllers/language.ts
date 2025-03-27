import { Request, Response } from "express";

import { getAllLanguages } from "@services/language";
import asyncErrorHandler from "@utils/asyncErrorHandler";

const getLanguages = asyncErrorHandler(async (req: Request, res: Response) => {
  const languages = await getAllLanguages();

  res.json({ success: true, data: languages });
});

export { getLanguages };
