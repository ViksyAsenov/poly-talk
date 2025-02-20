import { Router } from 'express';

import authRouter from '@routes/auth';

const mainRouter = Router();

mainRouter.use('/auth', authRouter);

export default mainRouter;
