# PolyTalk - Backend

This is the backend service for the PolyTalk chat application. It handles user authentication, real-time communication via WebSockets, message storage, user/friend management, and most importantly, the real-time translation logic by integrating LibreTranslate.

## Features

- **User Authentication:** Secure login/signup using Google OAuth 2.0.
- **Session Management:** Persistent user sessions stored in PostgreSQL.
- **Profile Management:** Allows users to view and update their profile (display name, preferred language).
- **Friend System:** Functionality to send, accept, reject friend requests, view friends, and remove friends.
- **Chat Management:** Creation and management of direct (1-to-1) and group conversations.
- **Real-time Messaging:** Uses Socket.IO for instant message delivery and updates.
- **Automatic Translation:** Integrates with a self-hosted LibreTranslate instance to automatically translate incoming messages based on the recipient's preferred language.
- **Translation Caching:** Stores successfully translated messages in the database to avoid redundant API calls.
- **API:** Provides a RESTful API for frontend interactions.
- **Database Management:** Uses Drizzle ORM for type-safe database interactions and Drizzle Kit for schema migrations.

## Technology Stack

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (v15+)
- **ORM / Query Builder:** Drizzle ORM
- **Real-time Communication:** Socket.IO
- **Translation Service:** LibreTranslate (Self-hosted via Docker)
- **Containerization:** Docker, Docker Compose
- **Validation:** Zod
- **Configuration:** Convict
- **Logging:** Pino
- **Session Store:** connect-pg-simple

## Prerequisites

- Node.js (version 20.0.0 or higher)
- npm
- Docker and Docker Compose

## Getting Started

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/ViksyAsenov/poly-talk
    cd poly-talk/backend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    - Create a `.env` file in the `poly-talk/backend` directory by copying the `.env.example` file.
    - Fill in the required environment variables. Essential variables include:
      - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
      - `GOOGLE_SECRET`: Your Google OAuth Client Secret.
      - `GOOGLE_REDIRECT_URL`: The redirect URL configured in Google Cloud Console (e.g., `http://localhost:3005/auth/google/callback`).
      - `DB_USER`: PostgreSQL username.
      - `DB_NAME`: PostgreSQL database name.
      - `DB_HOST`: PostgreSQL host.
      - `DB_PASSWORD`: PostgreSQL password.
      - `DB_PORT`: PostgreSQL port.
      - `AUTH_SECRET`: A long, random secret string for session signing.
      - `API_URL`: Full URL of the backend API (e.g., `http://localhost:3005`).
      - `APP_URL`: Full URL of the frontend application (e.g., `http://localhost:3000`). Used for CORS and redirects.
      - `LIBRETRANSLATE_URL`: URL of the LibreTranslate service (e.g., `http://localhost:5000` if using the provided Docker Compose).
      - `PORT`: Port for the backend server.

4.  **Start Dependent Services (Database & Translator):**

    - Ensure Docker and Docker Compose are running.
    - From the `poly-talk/backend` directory, run:
      ```bash
      docker-compose up -d
      ```
    - This will start the PostgreSQL and LibreTranslate containers in the background. Wait a minute or two for LibreTranslate to download language models on the first run.

5.  **Database Setup:**
    - Create the database schema by running:
      ```bash
      npm run db:generate
      ```
    - Apply the database schema migration:
      ```bash
      npm run db:migrate
      ```
    - Seed the supported languages by running:
      ```bash
      npm run db:seed
      ```

## Available Scripts

- **`npm start`**: Starts the backend server using `tsx` (suitable for simple execution or production with a process manager).
- **`npm run dev`**: Starts the backend server in development mode using `tsx` with `nodemon` for automatic restarts and `pino-pretty` for formatted logs.
- **`npm run db:generate`**: Generates SQL migration files based on changes in your Drizzle schema (`src/services/**/models/*.ts`).
- **`npm run db:migrate`**: Applies pending database migrations.
- **`npm run db:rollback`**: Drops the database schema (Use with caution!).
- **`npm run db:studio`**: Opens Drizzle Studio, a GUI for browsing your database.
- **`npm run db:seed`**: Runs database seeding scripts located in `.drizzle/seed/index.ts`.
- **`npm run build`**: Compiles the TypeScript code to JavaScript in the `dist` directory (requires `tsc-alias` for path alias resolution if used).
- **`npm run pretty`**: Formats the code using Prettier.
- **`npm run lint`**: Lints the codebase using ESLint.
- **`npm run lint:fix`**: Attempts to automatically fix linting issues.

## Running the Backend

1.  Make sure Docker services (Postgres, LibreTranslate) are running.
2.  Ensure the database is setup.
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (default 3005).

## Docker Usage

The `docker-compose.yaml` file defines the necessary services:

- **`postgres`**: Runs the PostgreSQL database instance. Data is persisted in the `db_data` volume.
- **`libretranslate`**: Runs the LibreTranslate service. Language models are specified via `LT_LOAD_ONLY` and persisted in the `libretranslate_models` volume.
