import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PlacedStudent = sequelize.define(
  "PlacedStudent",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    placementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
  },
  {
    tableName: "placedStudents",
    timestamps: true,
  },
);

export { PlacedStudent };
