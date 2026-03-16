import { Internship } from "../models/internshipModel.js";

const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.status(200).json({
      success: true,
      data: internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }
    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInternship = async (req, res) => {
  try {
    const [updatedCount] = await Internship.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    const internship = await Internship.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInternship = async (req, res) => {
  try {
    const deletedCount = await Internship.destroy({
      where: { id: req.params.id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
};
