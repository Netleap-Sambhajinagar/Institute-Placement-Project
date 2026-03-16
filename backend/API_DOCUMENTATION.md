# Backend API Documentation

## Institute Placement Portal

**Base URL:** `http://localhost:5000/api`  
**Stack:** Node.js · Express.js · MySQL (Sequelize ORM) · Redis (cache & OTP)  
**Auth:** HTTP-only cookie (`token`) set automatically on login/register. Token is JWT, valid for **7 days**.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Students](#2-students)
3. [Courses](#3-courses)
4. [Course Enrollments](#4-course-enrollments)
5. [Jobs](#5-jobs)
6. [Internships](#6-internships)
7. [Interns (Applied Internships)](#7-interns)
8. [Placed Students](#8-placed-students)
9. [Auth Middleware](#9-auth-middleware)
10. [Error Responses](#10-error-responses)
11. [Data Models Reference](#11-data-models-reference)

---

## 1. Authentication

All auth endpoints are prefixed with `/api/auth`.

---

### 1.1 Register Student (Step 1 — Send OTP)

**`POST /api/auth/student/register`**

Validates the email and sends a 6-digit OTP to the provided email. The OTP expires in **5 minutes** (300 seconds).

#### Request Body

```json
{
  "name": "John Doe", // required
  "email": "john@example.com", // required
  "phone": "9876543210", // required
  "password": "secret123", // required
  "gender": "Male", // optional
  "DOB": "2000-01-15", // optional  (ISO date string)
  "education": "B.Tech", // optional
  "college": "NIT Silchar", // optional
  "domain": "Web Development" // optional
}
```

#### Success Response — `200 OK`

```json
{
  "message": "OTP sent to your email. Verify OTP to complete registration.",
  "email": "john@example.com",
  "expiresInSeconds": 300
}
```

#### Error Responses

| Status | Message                                          |
| ------ | ------------------------------------------------ |
| 400    | `"name, email, phone and password are required"` |
| 409    | `"Email already registered"`                     |

---

### 1.2 Register Student (Step 2 — Verify OTP)

**`POST /api/auth/student/register/verify-otp`**

Verifies the OTP. On success, creates the student account and sets the auth cookie.

#### Request Body

```json
{
  "email": "john@example.com",
  "otp": "482910"
}
```

#### Success Response — `201 Created`

Sets `token` cookie. Also returns:

```json
{
  "message": "Student registered successfully",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Error Responses

| Status | Message                        |
| ------ | ------------------------------ |
| 400    | `"email and otp are required"` |
| 400    | `"OTP expired or not found"`   |
| 400    | `"Invalid OTP"`                |
| 409    | `"Email already registered"`   |

---

### 1.3 Student Login

**`POST /api/auth/student/login`**

Sets the auth cookie on success.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Success Response — `200 OK`

```json
{
  "message": "Student login successful",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Error Responses

| Status | Message                             |
| ------ | ----------------------------------- |
| 400    | `"email and password are required"` |
| 401    | `"Invalid credentials"`             |

---

### 1.4 Admin Register

**`POST /api/auth/admin/register`**

Requires a secret `setupKey` (configured in server environment as `ADMIN_SETUP_KEY`).

#### Request Body

```json
{
  "name": "Admin User",
  "email": "admin@nits.ac.in",
  "password": "adminpass",
  "setupKey": "<ADMIN_SETUP_KEY from .env>"
}
```

#### Success Response — `201 Created`

Sets `token` cookie. Also returns:

```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nits.ac.in"
  }
}
```

#### Error Responses

| Status | Message                                             |
| ------ | --------------------------------------------------- |
| 400    | `"name, email, password and setupKey are required"` |
| 403    | `"Invalid admin setup key"`                         |
| 409    | `"Email already registered"`                        |

---

### 1.5 Admin Login

**`POST /api/auth/admin/login`**

Sets the auth cookie on success.

#### Request Body

```json
{
  "email": "admin@nits.ac.in",
  "password": "adminpass"
}
```

#### Success Response — `200 OK`

```json
{
  "message": "Admin login successful",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nits.ac.in"
  }
}
```

---

### 1.6 Get Current Logged-In User

**`GET /api/auth/me`** — 🔒 Requires auth cookie

Returns the profile of whoever is currently logged in (student or admin). Password is excluded.

#### Success Response — `200 OK` (student)

```json
{
  "role": "student",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "gender": "Male",
    "DOB": "2000-01-15T00:00:00.000Z",
    "education": "B.Tech",
    "college": "NIT Silchar",
    "domain": "Web Development",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Success Response — `200 OK` (admin)

```json
{
  "role": "admin",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nits.ac.in",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 1.7 Logout

**`POST /api/auth/logout`**

Clears the auth cookie.

#### Success Response — `200 OK`

```json
{ "message": "Logged out successfully" }
```

---

## 2. Students

**Base path:** `/api/students`

---

### 2.1 Get All Students

**`GET /api/students`**

Returns all students. Response is cached in Redis for **10 seconds**.

#### Success Response — `200 OK`

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "...(hashed)...",
    "gender": "Male",
    "DOB": "2000-01-15T00:00:00.000Z",
    "education": "B.Tech",
    "college": "NIT Silchar",
    "domain": "Web Development",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

> **Note:** The password hash is included in this response. Use `GET /api/auth/me` for current user profile without the password.

---

### 2.2 Get Student by ID

**`GET /api/students/:id`**

#### Success Response — `200 OK`

Returns a single student object (same shape as above).

#### Error Response

| Status | Message               |
| ------ | --------------------- |
| 404    | `"Student not found"` |

---

### 2.3 Create Student

**`POST /api/students`**

Creates a student directly (no OTP). Intended for admin use.

#### Request Body

```json
{
  "name": "Jane Smith", // required
  "email": "jane@example.com", // required
  "phone": "9123456780", // required
  "password": "pass123", // required — auto-hashed
  "gender": "Female", // optional
  "DOB": "2001-05-20", // optional
  "education": "B.Tech", // optional
  "college": "NIT Silchar", // optional
  "domain": "Data Science" // optional
}
```

#### Success Response — `201 Created`

Returns the created student object.

---

### 2.4 Update Student

**`PUT /api/students/:id`**

Send only the fields you want to update.

#### Request Body (example — any subset of student fields)

```json
{
  "phone": "9999999999",
  "college": "IIT Guwahati",
  "domain": "Machine Learning"
}
```

#### Success Response — `200 OK`

Returns the full updated student object.

---

### 2.5 Delete Student

**`DELETE /api/students/:id`**

Deletes the student and all related records in a transaction:

- All `interns` records for this student
- All `placedStudents` records for this student
- All `course_enrollments` for this student

#### Success Response — `200 OK`

```json
{
  "message": "Student and related records deleted successfully",
  "deletedRelated": {
    "interns": 2,
    "placedStudents": 1,
    "courseEnrollments": 3
  }
}
```

---

## 3. Courses

**Base path:** `/api/courses`

---

### 3.1 Get All Courses

**`GET /api/courses`**

#### Success Response — `200 OK`

```json
[
  {
    "id": 1,
    "title": "Full Stack Web Development",
    "level": "intermediate",
    "instructor": "Dr. A. Sharma",
    "img": "https://...",
    "duration": 60,
    "branch": "CSE",
    "overview": "...",
    "what_you_will_learn": "...",
    "course_features": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### 3.2 Get Course by ID

**`GET /api/courses/:id`**

#### Success Response — `200 OK`

Returns a single course object.

#### Error Response

| Status | Message                                                     |
| ------ | ----------------------------------------------------------- |
| 404    | `"Course not found"` (as `{ "error": "Course not found" }`) |

---

### 3.3 Create Course

**`POST /api/courses`**

#### Request Body

```json
{
  "title": "Python for Data Science", // required
  "level": "beginner", // required: beginner | intermediate | advanced
  "instructor": "Prof. B. Das", // required
  "img": "https://...", // optional
  "duration": 45, // required (integer, in days/hours — unit is up to you)
  "branch": "CSE", // required
  "overview": "Learn Python from scratch...", // required
  "what_you_will_learn": "NumPy, Pandas, ...", // optional
  "course_features": "Certificate, Projects" // optional
}
```

#### Success Response — `201 Created`

Returns the created course object.

---

### 3.4 Update Course

**`PUT /api/courses/:id`**

Send any subset of course fields.

#### Success Response — `200 OK`

Returns the full updated course object.

---

### 3.5 Delete Course

**`DELETE /api/courses/:id`**

#### Success Response — `200 OK`

```json
{ "message": "Course deleted" }
```

---

## 4. Course Enrollments

**Base path:** `/api/course-enrollments`

Tracks which student is enrolled in which course.

---

### 4.1 Get All Enrollments

**`GET /api/course-enrollments`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 3,
      "courseId": 2,
      "status": "active",
      "enrolledAt": "2026-03-01T10:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 4.2 Get Enrollment by ID

**`GET /api/course-enrollments/:id`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...enrollment object... }
}
```

---

### 4.3 Create Enrollment

**`POST /api/course-enrollments`**

Validates that both student and course exist. The combination of `studentId + courseId` must be unique.

#### Request Body

```json
{
  "studentId": 3, // required
  "courseId": 2, // required
  "status": "active", // optional (default: "active")
  "enrolledAt": "2026-03-01" // optional (default: current timestamp)
}
```

#### Success Response — `201 Created`

```json
{
  "success": true,
  "data": { ...enrollment object... }
}
```

#### Error Responses

| Status | Message                                            |
| ------ | -------------------------------------------------- |
| 400    | `"studentId and courseId are required"`            |
| 404    | `"Student not found"`                              |
| 404    | `"Course not found"`                               |
| 400    | Duplicate enrollment (unique constraint violation) |

---

### 4.4 Update Enrollment

**`PUT /api/course-enrollments/:id`**

Commonly used to update `status` (e.g., `"active"` → `"completed"`).

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...updated enrollment object... }
}
```

---

### 4.5 Delete Enrollment

**`DELETE /api/course-enrollments/:id`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Course enrollment deleted successfully"
}
```

---

## 5. Jobs

**Base path:** `/api/jobs`

> **Access Control:** `GET` endpoints are public. `POST`, `PUT`, `DELETE` require a logged-in **admin**.

---

### 5.1 Get All Jobs

**`GET /api/jobs`** — Public

Returns jobs sorted by newest first.

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "position": "Software Engineer",
      "company": "Google",
      "logo": "https://...",
      "location": "Bangalore",
      "salary": "18-25 LPA",
      "jobURL": "https://careers.company.com/jobs/123",
      "description": "...",
      "requirements": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 5.2 Get Job by ID

**`GET /api/jobs/:id`** — Public

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...job object... }
}
```

---

### 5.3 Create Job

**`POST /api/jobs`** — 🔒 Admin only

#### Request Body

```json
{
  "position": "Backend Developer", // required
  "company": "Amazon", // required
  "logo": "https://...", // optional
  "location": "Hyderabad", // required
  "salary": "20-30 LPA", // optional
  "jobURL": "https://careers.amazon.com/job/123", // optional
  "description": "...", // optional
  "requirements": "Node.js, MySQL..." // optional
}
```

#### Success Response — `201 Created`

```json
{
  "success": true,
  "data": { ...created job object... }
}
```

---

### 5.4 Update Job

**`PUT /api/jobs/:id`** — 🔒 Admin only

Send any subset of job fields.

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...updated job object... }
}
```

---

### 5.5 Delete Job

**`DELETE /api/jobs/:id`** — 🔒 Admin only

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## 6. Internships

**Base path:** `/api/internships`

Internship listings (available openings). Not to be confused with **Interns** (applied/enrolled records).

---

### 6.1 Get All Internships

**`GET /api/internships`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer Intern",
      "duration": 3,
      "category": "paid",
      "stipend": 15000,
      "location": "remote",
      "branch": "CSE",
      "description": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 6.2 Get Internship by ID

**`GET /api/internships/:id`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...internship object... }
}
```

---

### 6.3 Create Internship

**`POST /api/internships`**

#### Request Body

```json
{
  "title": "ML Research Intern", // required
  "duration": 6, // required (integer months)
  "category": "paid", // required: "paid" | "free"
  "stipend": 20000, // optional (null if free)
  "location": "on-site", // required: "on-site" | "remote"
  "branch": "CSE", // required
  "description": "..." // optional
}
```

#### Success Response — `201 Created`

```json
{
  "success": true,
  "data": { ...created internship object... }
}
```

---

### 6.4 Update Internship

**`PUT /api/internships/:id`**

Send any subset of internship fields.

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...updated internship object... }
}
```

---

### 6.5 Delete Internship

**`DELETE /api/internships/:id`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Internship deleted successfully"
}
```

---

## 7. Interns

**Base path:** `/api/interns`

An **intern** record represents a student's active/completed internship engagement. Links a `student` to an `internship`.

---

### 7.1 Get All Interns

**`GET /api/interns`**

#### Success Response — `200 OK`

```json
[
  {
    "id": 1,
    "category": "paid",
    "stipend": 15000,
    "start_date": "2026-01-01T00:00:00.000Z",
    "end_date": "2026-04-01T00:00:00.000Z",
    "status": "ongoing",
    "internshipId": 2,
    "studentId": 5,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### 7.2 Get Intern by ID

**`GET /api/interns/:id`**

#### Success Response — `200 OK`

Returns a single intern object.

---

### 7.3 Create Intern

**`POST /api/interns`**

#### Request Body

```json
{
  "category": "paid", // required: "paid" | "free"
  "stipend": 15000, // optional
  "start_date": "2026-01-01", // required (ISO date)
  "end_date": "2026-04-01", // required (ISO date)
  "status": "ongoing", // required: e.g. "ongoing" | "completed" | "terminated"
  "internshipId": 2, // optional FK → internships.id
  "studentId": 5 // optional FK → students.id
}
```

#### Success Response — `201 Created`

Returns the created intern object.

---

### 7.4 Update Intern

**`PUT /api/interns/:id`**

Send any subset of intern fields (e.g., update `status` to `"completed"`).

#### Success Response — `200 OK`

Returns the full updated intern object.

---

### 7.5 Delete Intern

**`DELETE /api/interns/:id`**

#### Success Response — `200 OK`

```json
{ "message": "Intern deleted" }
```

---

## 8. Placed Students

**Base path:** `/api/placed-students`

Records of students who have been successfully placed in a company.

---

### 8.1 Get All Placed Students

**`GET /api/placed-students`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Microsoft",
      "position": "SDE-1",
      "salary": 2200000,
      "placementDate": "2026-02-15T00:00:00.000Z",
      "img": "https://...",
      "studentId": 3,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 8.2 Get Placed Student by ID

**`GET /api/placed-students/:id`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...placed student object... }
}
```

---

### 8.3 Create Placed Student

**`POST /api/placed-students`**

#### Request Body

```json
{
  "company": "Microsoft", // required
  "position": "SDE-1", // required
  "salary": 2200000, // optional (integer, annual CTC)
  "placementDate": "2026-02-15", // required (ISO date)
  "img": "https://...", // optional (student photo URL)
  "studentId": 3 // required FK → students.id
}
```

#### Success Response — `201 Created`

```json
{
  "success": true,
  "data": { ...created placed student object... }
}
```

---

### 8.4 Update Placed Student

**`PUT /api/placed-students/:id`**

Send any subset of fields.

#### Success Response — `200 OK`

```json
{
  "success": true,
  "data": { ...updated placed student object... }
}
```

---

### 8.5 Delete Placed Student

**`DELETE /api/placed-students/:id`**

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Placed student deleted successfully"
}
```

---

## 9. Auth Middleware

Two middleware functions protect routes:

### `verifyToken`

Extracts JWT from:

1. **HTTP-only cookie** named `token` (primary)
2. **Authorization header** `Bearer <token>` (fallback)

Attaches decoded payload `{ id, role }` to `req.user`.

| Status | Message                                        |
| ------ | ---------------------------------------------- |
| 401    | `"Missing or invalid token"` (no token found)  |
| 401    | `"Invalid or expired token"` (bad/expired JWT) |

### `authorizeRoles(...roles)`

Must be used **after** `verifyToken`. Checks `req.user.role` against allowed roles.

| Status | Message       |
| ------ | ------------- |
| 403    | `"Forbidden"` |

**Example:** Admin-only route protection (used on Jobs write endpoints):

```
verifyToken  →  authorizeRoles("admin")
```

---

## 10. Error Responses

All error responses follow one of these two shapes depending on the endpoint group:

**Shape A** (Auth, Students, Interns, Courses):

```json
{ "message": "Human-readable error description" }
```

**Shape B** (Jobs, Internships, Course Enrollments, Placed Students):

```json
{ "success": false, "message": "Human-readable error description" }
```

**Courses error shape:**

```json
{ "error": "Human-readable error description" }
```

### Common HTTP Status Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 200  | OK                               |
| 201  | Created                          |
| 400  | Bad request / validation error   |
| 401  | Unauthenticated                  |
| 403  | Forbidden (wrong role)           |
| 404  | Resource not found               |
| 409  | Conflict (e.g., duplicate email) |
| 500  | Internal server error            |

---

## 11. Data Models Reference

### Student

| Field     | Type         | Required | Notes                  |
| --------- | ------------ | -------- | ---------------------- |
| id        | INT          | auto     | Primary key            |
| name      | VARCHAR(255) | ✅       |                        |
| email     | VARCHAR(255) | ✅       | Unique                 |
| phone     | VARCHAR(15)  | ✅       |                        |
| password  | VARCHAR(255) | ✅       | bcrypt hashed          |
| gender    | VARCHAR(255) |          |                        |
| DOB       | DATETIME     |          |                        |
| education | VARCHAR(255) |          | e.g. "B.Tech"          |
| college   | VARCHAR(255) |          |                        |
| domain    | VARCHAR(255) |          | e.g. "Web Development" |
| createdAt | DATETIME     | auto     |                        |
| updatedAt | DATETIME     | auto     |                        |

### Admin

| Field     | Type         | Required | Notes         |
| --------- | ------------ | -------- | ------------- |
| id        | INT          | auto     | Primary key   |
| name      | VARCHAR(255) | ✅       |               |
| email     | VARCHAR(255) | ✅       | Unique        |
| password  | VARCHAR(255) | ✅       | bcrypt hashed |
| createdAt | DATETIME     | auto     |               |
| updatedAt | DATETIME     | auto     |               |

### Course

| Field               | Type         | Required | Notes                              |
| ------------------- | ------------ | -------- | ---------------------------------- |
| id                  | INT          | auto     |                                    |
| title               | VARCHAR(255) | ✅       |                                    |
| level               | VARCHAR(255) | ✅       | beginner / intermediate / advanced |
| instructor          | VARCHAR(255) | ✅       |                                    |
| img                 | VARCHAR(255) |          | URL                                |
| duration            | INT          | ✅       |                                    |
| branch              | VARCHAR(255) | ✅       | e.g. "CSE"                         |
| overview            | TEXT         | ✅       |                                    |
| what_you_will_learn | TEXT         |          |                                    |
| course_features     | TEXT         |          |                                    |

### CourseEnrollment

| Field      | Type         | Required | Notes               |
| ---------- | ------------ | -------- | ------------------- |
| id         | INT          | auto     |                     |
| studentId  | INT          | ✅       | FK → students       |
| courseId   | INT          | ✅       | FK → courses        |
| status     | VARCHAR(255) |          | default: `"active"` |
| enrolledAt | DATETIME     |          | default: now        |

Unique constraint on `(studentId, courseId)`.

### Job

| Field        | Type         | Required | Notes                   |
| ------------ | ------------ | -------- | ----------------------- |
| id           | INT          | auto     |                         |
| position     | VARCHAR(255) | ✅       |                         |
| company      | VARCHAR(255) | ✅       |                         |
| logo         | VARCHAR(255) |          | URL                     |
| location     | VARCHAR(255) | ✅       |                         |
| salary       | VARCHAR(255) |          | string e.g. "18-25 LPA" |
| jobURL       | VARCHAR(255) |          | job application URL     |
| description  | TEXT         |          |                         |
| requirements | TEXT         |          |                         |

### Internship

| Field       | Type         | Required | Notes                |
| ----------- | ------------ | -------- | -------------------- |
| id          | INT          | auto     |                      |
| title       | VARCHAR(255) | ✅       |                      |
| duration    | INT          | ✅       | months               |
| category    | VARCHAR(255) | ✅       | "paid" / "free"      |
| stipend     | INT          |          | null for free        |
| location    | VARCHAR(255) | ✅       | "on-site" / "remote" |
| branch      | VARCHAR(255) | ✅       |                      |
| description | TEXT         |          |                      |

### Intern (Applied Internship Record)

| Field        | Type         | Required | Notes                          |
| ------------ | ------------ | -------- | ------------------------------ |
| id           | INT          | auto     |                                |
| category     | VARCHAR(255) | ✅       | "paid" / "free"                |
| stipend      | INT          |          |                                |
| start_date   | DATETIME     | ✅       |                                |
| end_date     | DATETIME     | ✅       |                                |
| status       | VARCHAR(255) | ✅       | "ongoing" / "completed" / etc. |
| internshipId | INT          |          | FK → internships               |
| studentId    | INT          |          | FK → students                  |

### PlacedStudent

| Field         | Type         | Required | Notes             |
| ------------- | ------------ | -------- | ----------------- |
| id            | INT          | auto     |                   |
| company       | VARCHAR(255) | ✅       |                   |
| position      | VARCHAR(255) | ✅       |                   |
| salary        | INT          |          | annual CTC        |
| placementDate | DATETIME     | ✅       |                   |
| img           | VARCHAR(255) |          | student photo URL |
| studentId     | INT          | ✅       | FK → students     |

---

## Quick Reference — All Endpoints

| Method | URL                                     | Auth     | Description                |
| ------ | --------------------------------------- | -------- | -------------------------- |
| POST   | `/api/auth/student/register`            | Public   | Send OTP to email          |
| POST   | `/api/auth/student/register/verify-otp` | Public   | Verify OTP, create account |
| POST   | `/api/auth/student/login`               | Public   | Student login              |
| POST   | `/api/auth/admin/register`              | setupKey | Admin registration         |
| POST   | `/api/auth/admin/login`                 | Public   | Admin login                |
| GET    | `/api/auth/me`                          | Cookie   | Get current user           |
| POST   | `/api/auth/logout`                      | Public   | Logout (clear cookie)      |
| GET    | `/api/students`                         | Public   | List all students          |
| GET    | `/api/students/:id`                     | Public   | Get student by ID          |
| POST   | `/api/students`                         | Public   | Create student             |
| PUT    | `/api/students/:id`                     | Public   | Update student             |
| DELETE | `/api/students/:id`                     | Public   | Delete student + related   |
| GET    | `/api/courses`                          | Public   | List all courses           |
| GET    | `/api/courses/:id`                      | Public   | Get course by ID           |
| POST   | `/api/courses`                          | Public   | Create course              |
| PUT    | `/api/courses/:id`                      | Public   | Update course              |
| DELETE | `/api/courses/:id`                      | Public   | Delete course              |
| GET    | `/api/course-enrollments`               | Public   | List all enrollments       |
| GET    | `/api/course-enrollments/:id`           | Public   | Get enrollment by ID       |
| POST   | `/api/course-enrollments`               | Public   | Enroll student in course   |
| PUT    | `/api/course-enrollments/:id`           | Public   | Update enrollment          |
| DELETE | `/api/course-enrollments/:id`           | Public   | Delete enrollment          |
| GET    | `/api/jobs`                             | Public   | List all jobs              |
| GET    | `/api/jobs/:id`                         | Public   | Get job by ID              |
| POST   | `/api/jobs`                             | Admin    | Create job                 |
| PUT    | `/api/jobs/:id`                         | Admin    | Update job                 |
| DELETE | `/api/jobs/:id`                         | Admin    | Delete job                 |
| GET    | `/api/internships`                      | Public   | List all internships       |
| GET    | `/api/internships/:id`                  | Public   | Get internship by ID       |
| POST   | `/api/internships`                      | Public   | Create internship          |
| PUT    | `/api/internships/:id`                  | Public   | Update internship          |
| DELETE | `/api/internships/:id`                  | Public   | Delete internship          |
| GET    | `/api/interns`                          | Public   | List all intern records    |
| GET    | `/api/interns/:id`                      | Public   | Get intern record by ID    |
| POST   | `/api/interns`                          | Public   | Create intern record       |
| PUT    | `/api/interns/:id`                      | Public   | Update intern record       |
| DELETE | `/api/interns/:id`                      | Public   | Delete intern record       |
| GET    | `/api/placed-students`                  | Public   | List all placed students   |
| GET    | `/api/placed-students/:id`              | Public   | Get placed student by ID   |
| POST   | `/api/placed-students`                  | Public   | Create placed student      |
| PUT    | `/api/placed-students/:id`              | Public   | Update placed student      |
| DELETE | `/api/placed-students/:id`              | Public   | Delete placed student      |
