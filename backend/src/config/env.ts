import convict from 'convict';
import 'dotenv/config';
import convict_format_with_validator from 'convict-format-with-validator';

import { version, author } from '@package';

convict.addFormats(convict_format_with_validator);

const config = convict({
  app: {
    env: {
      doc: 'The application environment.',
      format: ['production', 'development', 'test'],
      default: 'development',
      env: 'NODE_ENV',
    },
    port: {
      doc: 'The port the server will listen on.',
      format: 'port',
      default: 3005,
      env: 'PORT',
    },
    api_url: {
      doc: 'The URL of the API.',
      format: 'url',
      default: 'http://localhost:3005',
      env: 'API_URL',
    },
    client_url: {
      doc: 'The URL of the client application.',
      format: 'url',
      default: 'http://localhost:3000',
      env: 'APP_URL',
    },
    version: {
      doc: 'The version of the application.',
      format: String,
      default: version,
    },
    author: {
      doc: 'The author of the application.',
      format: String,
      default: author,
    },
    name: {
      doc: 'The name of the application.',
      format: String,
      default: 'PolyTalk API',
    },
  },
  db: {
    host: {
      doc: 'The host of the database.',
      format: String,
      default: 'localhost',
      env: 'DB_HOST',
    },
    port: {
      doc: 'The port the database is listening on.',
      format: 'port',
      default: 27017,
      env: 'DB_PORT',
    },
    name: {
      doc: 'The name of the database.',
      format: String,
      default: 'polytalk',
      env: 'DB_NAME',
    },
    user: {
      doc: 'The username to connect to the database.',
      format: String,
      default: '',
      env: 'DB_USER',
    },
    password: {
      doc: 'The password to connect to the database.',
      format: String,
      default: '',
      env: 'DB_PASSWORD',
    },
  },
  redis: {
    url: {
      doc: 'The URL of the Redis server.',
      format: String,
      default: 'redis://localhost:6379',
      env: 'REDIS_URL',
    },
  },
  auth: {
    secret: {
      doc: 'The secret key for the auth.',
      format: String,
      default: '',
      env: 'AUTH_SECRET',
    },
  },
  google: {
    clientId: {
      doc: 'The client ID for Google OAuth.',
      format: String,
      default: '',
      env: 'GOOGLE_CLIENT_ID',
    },
    secret: {
      doc: 'The secret for Google OAuth.',
      format: String,
      default: '',
      env: 'GOOGLE_SECRET',
    },
    redirectUrl: {
      doc: 'The redirect URL for Google OAuth.',
      format: 'url',
      default: '',
      env: 'GOOGLE_REDIRECT_URL',
    },
  },
});

config.validate({ allowed: 'strict' });

export default config.getProperties();
