# Redis Setup Guide

This guide explains what Redis is doing in this project, how to run it locally on Windows, how to configure it, and how to verify that it is working.

## Why this project uses Redis

In this backend, Redis is used for two things:

1. Temporary OTP storage during student registration.
2. Short-lived caching of the student list.

Current Redis usage in the code:

- `backend/config/redis.js`: creates the Redis client.
- `backend/controllers/authController.js`: stores OTP data with expiry.
- `backend/controllers/studentController.js`: caches the `students` list for 10 seconds.

## How Redis works here

### OTP flow

When a student registers:

1. The backend hashes the password.
2. It generates a 6-digit OTP.
3. It stores the OTP and pending student data in Redis.
4. It sends the OTP by email.
5. When the OTP is verified, the backend reads the data from Redis and creates the student in MySQL.

Redis key format used for OTP:

```text
otp:student:register:<email>
```

Expiry used for OTP:

```text
OTP_TTL_SECONDS
```

Default value if not set:

```text
300 seconds
```

### Student list cache

When the backend fetches all students:

1. It first checks Redis for a `students` key.
2. If the key exists, it returns cached data.
3. If the key does not exist, it reads from MySQL.
4. It stores the result in Redis for 10 seconds.

Cache key used:

```text
students
```

Current cache expiry:

```text
10 seconds
```

## Redis connection used by this project

The Redis client is created here:

```js
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export { redis };
```

That means:

- If `REDIS_URL` is present, the app connects to that Redis instance.
- If `REDIS_URL` is missing, it falls back to local Redis on port `6379`.

## Recommended local setup on Windows

The easiest option on Windows is Docker Desktop.

### Option 1: Run Redis with Docker

If Docker Desktop is installed, run:

```powershell
docker run --name nits-redis -p 6379:6379 -d redis:7
```

To check that the container is running:

```powershell
docker ps
```

To stop it later:

```powershell
docker stop nits-redis
```

To start it again:

```powershell
docker start nits-redis
```

### Option 2: Use a hosted Redis service

You can also use a hosted Redis service such as Upstash or Redis Cloud.

In that case:

1. Create a Redis database.
2. Copy the connection string.
3. Put it in `REDIS_URL` inside your backend `.env` file.

Example:

```env
REDIS_URL=redis://localhost:6379
```

Hosted providers often give a secure URL like this:

```env
REDIS_URL=rediss://default:<password>@your-host:6379
```

Use your own credentials. Do not commit real secrets to git.

## Backend environment variables

Add or check these values in the backend `.env` file:

```env
REDIS_URL=redis://localhost:6379
OTP_TTL_SECONDS=300
```

Notes:

- `REDIS_URL` tells the app where Redis is running.
- `OTP_TTL_SECONDS` controls how long a registration OTP stays valid.

## How to start the backend with Redis

From the backend folder:

```powershell
npm install
npm run dev
```

If Redis is running and the URL is correct, the backend should start normally.

## How to verify Redis is working

### Check 1: Basic Redis connection

If you are using Docker locally:

```powershell
docker exec -it nits-redis redis-cli ping
```

Expected result:

```text
PONG
```

### Check 2: OTP registration flow

Trigger student registration from the frontend or API.

After registration starts, Redis should contain a key like:

```text
otp:student:register:student@example.com
```

If using local Docker Redis, list keys with:

```powershell
docker exec -it nits-redis redis-cli keys "otp:*"
```

### Check 3: Student cache

Call the students API twice.

Example route depends on your frontend usage, but after the first successful fetch, Redis should contain:

```text
students
```

Check it with:

```powershell
docker exec -it nits-redis redis-cli get students
```

Or check whether the key exists:

```powershell
docker exec -it nits-redis redis-cli exists students
```

## Common problems

### 1. `ECONNREFUSED 127.0.0.1:6379`

Reason:

- Redis is not running locally.
- Or `REDIS_URL` points to the wrong place.

Fix:

- Start Redis.
- Check the port.
- Recheck `REDIS_URL`.

### 2. OTP verification always fails

Reason:

- Redis key expired before verification.
- Or backend is connected to a different Redis instance than expected.

Fix:

- Increase `OTP_TTL_SECONDS` if needed.
- Verify the correct `REDIS_URL` is loaded.

### 3. Cached students data looks stale

Reason:

- Student list is cached for 10 seconds.

Fix:

- Wait 10 seconds for expiry.
- Or manually delete the key:

```powershell
docker exec -it nits-redis redis-cli del students
```

## Important project note

Right now, the `students` cache is cleared on student delete, but not consistently on every student create or update path. That means a recent add or update may not appear immediately until the 10-second cache expires.

This is not a Redis setup issue. It is current application behavior.

## Quick setup summary

1. Start Redis locally with Docker, or get a hosted Redis URL.
2. Set `REDIS_URL` in `backend/.env`.
3. Optionally set `OTP_TTL_SECONDS`.
4. Start the backend with `npm run dev`.
5. Test registration OTP flow and student list caching.

## Files to read if you want to understand the implementation

- `backend/config/redis.js`
- `backend/controllers/authController.js`
- `backend/controllers/studentController.js`
- `backend/server.js`
