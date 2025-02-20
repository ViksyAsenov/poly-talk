import express, { Request } from 'express';

import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit';

import mainRouter from '@routes/index';

import logger from '@config/logger';
import config from '@config/env';
import { sessions } from '@middlewares/sessions';

const app = express();
const server = http.createServer(app);

app.set('trust proxy', 1);

app.use(
  bodyParser.json({
    verify: (req: Request, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(
  rateLimit({
    windowMs: 1000,
    limit: 15,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  }),
);

app.use(sessions);

app.use(mainRouter);

function start() {
  try {
    const start_ms = Date.now();

    server.listen(config.app.port, () => {
      const end_ms = Date.now();

      logger.info(
        {
          ...config.app,
          time: end_ms - start_ms,
        },
        'Server started successfully',
      );
    });
  } catch (error) {
    logger.error(
      {
        error,
      },
      'Server failed to start',
    );
  }
}

start();
