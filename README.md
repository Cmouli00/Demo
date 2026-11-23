# Shared Platform Demo

This repository contains a small full-stack platform demo:

- **app-1** - Next.js application on port `3000`
- **app-2** - Next.js application on port `3001`
- **backend** - Go/Gin API on port `8000`
- **MongoDB** - database on port `27017`
- **packages/** - shared TypeScript packages used by both applications

## Prerequisites

Install the following tools:

- Node.js
- pnpm `12.21.0`
- Docker Desktop and Docker Compose
- Go `1.27.1` (only required when running the backend outside Docker)

Check the installed versions:

```bash
node --version
pnpm --version
docker --version
docker compose version
go version
```

## Quick start with Docker

From the repository root, install the frontend dependencies:

```bash
pnpm install
```

Start MongoDB and the Go backend:

```bash
docker compose up --build -d
```

Start both Next.js applications in a second terminal:

```bash
pnpm dev
```

Open the applications:

- [App 1](http://localhost:3000)
- [App 2](http://localhost:3001)
- API base URL: `http://localhost:8000/api/v1`

The backend connects to MongoDB using the Docker service name
`mongodb`. MongoDB data is persisted in the Docker volume
`mongodb_data`.

To view backend logs:

```bash
docker compose logs -f backend
```

To stop the containers:

```bash
docker compose down
```

To stop the containers and remove the database volume:

```bash
docker compose down -v
```

## Run everything locally

### 1. Start MongoDB

You can run only MongoDB with Docker:

```bash
docker compose up -d mongodb
```

### 2. Start the Go backend

In a new terminal:

```bash
cd backend
go mod download
go run ./cmd/api
```

The backend uses these defaults when no environment variables are set:

| Variable | Default |
| --- | --- |
| `PORT` | `8000` |
| `MONGO_URI` | `mongodb://localhost:27017` |
| `MONGO_DATABASE` | `shared_platform` |
| `APP_ONE_ORIGIN` | empty |
| `APP_TWO_ORIGIN` | empty |

You can override them before starting the server:

```bash
PORT=8000 \
MONGO_URI=mongodb://localhost:27017 \
MONGO_DATABASE=blog \
APP_ONE_ORIGIN=http://localhost:3000 \
APP_TWO_ORIGIN=http://localhost:3001 \
go run ./cmd/api
```

### 3. Start the Next.js applications

From the repository root, in another terminal:

```bash
pnpm dev
```

The shared API client currently uses:
`http://localhost:8000/api/v1`.

## Useful commands

Run these commands from the repository root:

```bash
pnpm dev          # Start both Next.js applications
pnpm build        # Build all workspace packages and applications
pnpm lint         # Run ESLint across the workspace
pnpm check-types  # Run TypeScript checks
pnpm test         # Run configured tests
pnpm clean        # Remove generated Turbo/build output
```

Run a command for one application:

```bash
pnpm --filter app-1 dev
pnpm --filter app-2 dev
pnpm --filter app-1 build
pnpm --filter app-2 lint
```

Run the backend formatter and tests:

```bash
cd backend
gofmt -w $(find . -name '*.go' -type f)
go test ./...
```

## API routes

The enabled backend module is posts:

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/v1/posts` | Create a post |
| `GET` | `/api/v1/posts` | List/search posts |
| `GET` | `/api/v1/posts/:id` | Get one post |
| `PUT` | `/api/v1/posts/:id` | Update a post |
| `DELETE` | `/api/v1/posts/:id` | Delete a post |

The news and client modules are currently scaffolded but disabled in the
backend router.

## Troubleshooting

### Port already in use

Stop the process using ports `3000`, `3001`, `8000`, or `27017`, or change
the corresponding application/environment configuration.

### Backend cannot connect to MongoDB

- When the backend runs in Docker, use `mongodb://mongodb:27017`.
- When the backend runs directly on your machine, use
  `mongodb://localhost:27017`.
- Confirm MongoDB is running with:

  ```bash
  docker compose ps
  ```

### Frontend requests fail

Ensure the Go backend is running on port `8000`. The frontend API client
currently points to `http://localhost:8000/api/v1`.
