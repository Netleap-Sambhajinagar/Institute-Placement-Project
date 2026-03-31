export const queryKeys = {
  students: ["students"],
  jobs: ["jobs"],
  internships: ["internships"],
  courses: (params = {}) => ["courses", params],
  adminDashboard: ["adminDashboard"],
  adminInsights: ["adminInsights"],
  studentDashboard: (studentId) => ["studentDashboard", Number(studentId) || 0],
  courseDetails: (courseId) => ["courseDetails", String(courseId || "")],
  internshipDetails: (internshipId) => ["internshipDetails", String(internshipId || "")],
  courseEnrollmentStatus: (studentId, courseId) => [
    "courseEnrollmentStatus",
    Number(studentId) || 0,
    Number(courseId) || 0,
  ],
};
