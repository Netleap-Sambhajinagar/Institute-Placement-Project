import { Course } from "../models/courseModel.js";

const createCourse = async (req, res) => {
  const {
    title,
    level,
    instructor,
    img,
    duration,
    status,
    branch,
    overview,
    what_you_will_learn,
    course_features,
  } = req.body;

  if (!title || !level || !instructor) {
    return res
      .status(400)
      .json({ error: "Title, level, and instructor are required" });
  }

  const normalizedStatus =
    String(status || "Active").toLowerCase() === "inactive"
      ? "Inactive"
      : "Active";

  try {
    const course = await Course.create({
      title,
      level,
      instructor,
      img,
      duration,
      status: normalizedStatus,
      branch,
      overview,
      what_you_will_learn,
      course_features,
    });
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json(course);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const [updatedCount] = await Course.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await Course.findByPk(req.params.id);
    return res.json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deletedCount = await Course.destroy({
      where: { id: req.params.id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json({ message: "Course deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };
