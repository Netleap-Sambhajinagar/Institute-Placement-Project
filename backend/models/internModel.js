import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Intern = sequelize.define(
  "Intern",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false, //paid or free
    },
    stipend: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    internshipId: {
      type: DataTypes.INTEGER,
      references: {
        model: "internships",
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "students",
        key: "id",
      },
    },
  },
  {
    tableName: "interns",
    timestamps: true,
  },
);

export { Intern };
