import session from 'express-session';
import pgSession from 'connect-pg-simple';

import { dbUrl } from '@config/db';

import config from '@config/env';
import { RequestHandler } from 'express';

const sessions = session({
  store: new (pgSession(session))({
    conString: dbUrl,
    tableName: 'user_sessions',
  }),
  secret: config.auth.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: config.app.env === 'production' ? 'none' : 'lax',
    secure: config.app.env === 'production',
    domain: config.app.env === 'production' ? 'polytalk.live' : undefined,
  },
}) as unknown as RequestHandler;

export { sessions };
