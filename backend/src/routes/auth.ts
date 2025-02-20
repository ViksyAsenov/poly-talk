import { Router } from 'express';
import { getGoogleLoginUrl, handleGoogleCallback } from '@controllers/auth';
import { isNotAuth } from '@middlewares/auth';

const router = Router();

router.get('/google', isNotAuth, getGoogleLoginUrl);

router.get('/google/callback', isNotAuth, handleGoogleCallback);

export default router;
