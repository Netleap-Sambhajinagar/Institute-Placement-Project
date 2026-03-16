import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const getEnvOrDefault = (value, fallback) => {
  if (!value) return fallback;

  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("your-")) return fallback;

  return value;
};

const sequelize = new Sequelize(
  getEnvOrDefault(process.env.DB_NAME, "NITS"),
  getEnvOrDefault(process.env.DB_USER, "root"),
  getEnvOrDefault(process.env.DB_PASSWORD, "root"),
  {
    host: getEnvOrDefault(process.env.DB_HOST, "localhost"),
    dialect: "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
  },
);

export default sequelize;
