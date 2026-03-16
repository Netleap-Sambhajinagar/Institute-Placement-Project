import { Student } from "../models/studentsModel.js";
import { CourseEnrollment } from "../models/courseEnrollmentModel.js";
import { Intern } from "../models/internModel.js";
import { PlacedStudent } from "../models/placedStudentModel.js";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";
import { redis } from "../config/redis.js";

const getAllStudents = async (req, res) => {
  if (await redis.exists("students")) {
    const cachedStudents = await redis.get("students");
    return res.status(200).json(JSON.parse(cachedStudents));
  }
  try {
    const students = await Student.findAll();
    await redis.set("students", JSON.stringify(students));
    await redis.expire("students", 10);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create student
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      gender,
      DOB,
      education,
      college,
      domain,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "name, email, phone and password are required",
      });
    }

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await Student.create({
      name,
      email,
      phone,
      password: hashedPassword,
      gender,
      DOB,
      education,
      college,
      domain,
    });

    return res.status(201).json(newStudent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update student by ID
const updateStudent = async (req, res) => {
  try {
    const [updatedCount] = await Student.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = await Student.findByPk(req.params.id);
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const studentId = Number(req.params.id);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const student = await Student.findByPk(studentId, { transaction });

      if (!student) {
        return null;
      }

      const deletedInterns = await Intern.destroy({
        where: { studentId },
        transaction,
      });

      const deletedPlacedStudents = await PlacedStudent.destroy({
        where: { studentId },
        transaction,
      });

      const deletedCourseEnrollments = await CourseEnrollment.destroy({
        where: { studentId },
        transaction,
      });

      await Student.destroy({
        where: { id: studentId },
        transaction,
      });

      return {
        deletedInterns,
        deletedPlacedStudents,
        deletedCourseEnrollments,
      };
    });

    if (!result) {
      return res.status(404).json({ message: "Student not found" });
    }

    try {
      await redis.del("students");
    } catch (cacheError) {
      console.error("Failed to invalidate students cache:", cacheError.message);
    }

    res.status(200).json({
      message: "Student and related records deleted successfully",
      deletedRelated: {
        interns: result.deletedInterns,
        placedStudents: result.deletedPlacedStudents,
        courseEnrollments: result.deletedCourseEnrollments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
