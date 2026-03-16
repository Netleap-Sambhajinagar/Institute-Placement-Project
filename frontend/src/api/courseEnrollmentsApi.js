import client from "./client.js";

const toList = (response) => {
  const payload = response?.data?.data || response?.data;
  return Array.isArray(payload) ? payload : [];
};

export const createCourseEnrollment = async ({
  studentId,
  courseId,
  status = "active",
}) => {
  const payload = {
    courseId,
    status,
  };

  if (studentId !== undefined && studentId !== null) {
    payload.studentId = studentId;
  }

  const response = await client.post("/course-enrollments", payload);

  return response.data?.data || response.data;
};

export const hasCourseEnrollment = async ({ studentId, courseId }) => {
  const response = await client.get("/course-enrollments");
  const enrollments = toList(response);

  return enrollments.some(
    (enrollment) =>
      Number(enrollment.studentId) === Number(studentId) &&
      Number(enrollment.courseId) === Number(courseId),
  );
};

export const getCourseEnrollments = async () => {
  try {
    const response = await client.get("/course-enrollments");
    return toList(response);
  } catch (error) {
    console.error("Error fetching course enrollments", error);
    return [];
  }
};

export const getCourseEnrollmentsByStudent = async (studentId) => {
  const enrollments = await getCourseEnrollments();

  return enrollments.filter(
    (enrollment) => Number(enrollment.studentId) === Number(studentId),
  );
};

export const getCourseEnrollmentCountByStudent = async (studentId) => {
  if (!studentId) return 0;

  const response = await client.get("/course-enrollments");
  const enrollments = toList(response);

  return enrollments.filter(
    (enrollment) => Number(enrollment.studentId) === Number(studentId),
  ).length;
};
