# Notes Taking Backend

A TypeScript-based Express REST API for a secure note-taking and user management application. The backend supports user registration/login, JWT authentication, role-based access control, note management, post creation, and MongoDB aggregation queries.

## Features

- User registration and login
- JWT access and refresh token support
- Cookie-based authentication for browser clients
- Role-based authorization with `ADMIN` and `USER`
- User profile and admin user management
- CRUD operations for notes
- Personal note filtering via `my-notes`
- Post creation endpoint
- Aggregation APIs for user interest grouping and user stats
- Automatic super-admin creation on database startup

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- Zod for validation
- CORS + cookies support
- ESLint for linting

## Project Structure

```bash
src/
├── app.ts
├── server.ts
├── app/
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│   ├── errorHelpers/
│   ├── helpers/
│   ├── interfaces/
│   ├── middlewares/
│   │   ├── checkAuth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   ├── aggregations/
│   │   ├── auth/
│   │   ├── notes/
│   │   ├── posts/
│   │   └── user/
│   ├── routes/
│   │   └── index.ts
│   └── utils/
│       ├── catchAsync.ts
│       ├── jwt.ts
│       ├── QueryBuilder.ts
│       └── sendResponse.ts
└──
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection string
- A `.env` file configured with the required variables

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
DB_URL=mongodb://localhost:27017/notes-taking-db
NODE_ENV=development
BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES=7d
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=StrongAdminPassword123
FRONTEND_URL=http://localhost:3000
```

### Variable Notes

- `PORT`: Server port
- `DB_URL`: MongoDB connection string
- `NODE_ENV`: `development` or `production`
- `BCRYPT_SALT_ROUND`: Password hashing cost
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Secret keys for JWT signing
- `JWT_ACCESS_EXPIRES` / `JWT_REFRESH_EXPIRES`: Token expiration values such as `1h`, `7d`, etc.
- `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD`: Used to auto-create a default admin user on first startup
- `FRONTEND_URL`: Allowed frontend origin for CORS

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode with hot reload using `ts-node-dev`.

```bash
npm run build
```

Compiles the TypeScript project into the `dist` folder.

```bash
npm run start
```

Starts the built production server.

```bash
npm run lint
```

Runs ESLint against the source code.

## Running the App

```bash
npm run dev
```

The server starts and connects to MongoDB automatically. It also ensures a super admin exists using the configured `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` values.

## API Overview

All routes are mounted under:

```bash
/api/v1
```

### Authentication Routes

```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

#### Auth flow

- `register`: creates a new user, hashes the password, and returns user data plus tokens
- `login`: validates credentials and creates access/refresh tokens
- `refresh`: verifies the refresh token and issues a new access token
- `logout`: clears authentication cookies

The middleware accepts a token from either:

- `Authorization: Bearer <token>`
- `accessToken` cookie

### User Routes

```bash
POST /api/v1/users/              -> admin only
GET  /api/v1/users/               -> admin only
GET  /api/v1/users/me             -> admin or user
GET  /api/v1/users/:id            -> admin only
PATCH /api/v1/users/:id           -> admin only
DELETE /api/v1/users/:id          -> admin only
```

### Notes Routes

```bash
GET    /api/v1/notes/              -> admin sees all notes; user sees only their own
POST   /api/v1/notes/              -> create note
GET    /api/v1/notes/my-notes      -> get current user's notes
GET    /api/v1/notes/:id           -> get single note
PATCH  /api/v1/notes/:id           -> update note
DELETE /api/v1/notes/:id           -> delete note
```

Notes are linked to the authenticated user through the `owner` field.

### Posts Routes

```bash
POST /api/v1/posts/
```

Creates a post and assigns the authenticated user as the author.

### Aggregation Routes

```bash
GET /api/v1/aggregations/users/grouped-by-interest    -> admin only
GET /api/v1/aggregations/user/stats                   -> user only
GET /api/v1/aggregations/posts/user/:id               -> user/admin
```

These routes provide analytics and grouped data such as:

- users grouped by interest
- total posts and notes for a user
- interest count for a user
- paginated user posts

## Authentication & Authorization

This project uses JWT-based authentication with cookie support.

- Access token is used for protected routes.
- Refresh token is stored in an HTTP-only cookie.
- Authorization is validated by `checkAuth` middleware.
- User roles are defined as:
  - `ADMIN`
  - `USER`

## Error Handling

The app includes centralized error handling through the global error middleware and custom `AppError` helper. This makes API responses consistent and easier to debug.

## Notes

- The app is designed for a secure note-taking and user analytics workflow.
- It is also ready for extension with more modules such as comments, tags, file uploads, and richer post APIs.
- There is currently no automated test suite configured in the project (`test` script exits with an error placeholder), so this is an API-first backend project focused on development and deployment.

## License

This project is currently licensed under `ISC` as defined in `package.json`.
