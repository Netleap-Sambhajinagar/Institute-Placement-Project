import { QueryTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Student } from "../models/studentsModel.js";
import { Course } from "../models/courseModel.js";
import { Internship } from "../models/internshipModel.js";
import { PlacedStudent } from "../models/placedStudentModel.js";

const getAdminDashboard = async (_req, res) => {
  try {
    const [
      totalStudents,
      activeCourses,
      totalInternships,
      totalPlacements,
      recentStudents,
    ] = await Promise.all([
      Student.count(),
      Course.count({ where: { status: "Active" } }),
      Internship.count(),
      PlacedStudent.count(),
      sequelize.query(
        `
            SELECT
              s.id,
              s.name,
              s.email,
              s.domain,
              s.education,
              s.college,
              s.createdAt,
              CASE WHEN COUNT(ps.id) > 0 THEN 'Placed' ELSE 'Active' END AS placementStatus
            FROM students s
            LEFT JOIN placedStudents ps ON ps.studentId = s.id
            GROUP BY s.id, s.name, s.email, s.domain, s.education, s.college, s.createdAt
            ORDER BY s.createdAt DESC
            LIMIT 5
          `,
        { type: QueryTypes.SELECT },
      ),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          activeCourses,
          internships: totalInternships,
          placements: totalPlacements,
        },
        recentStudents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAdminDashboard,
};
