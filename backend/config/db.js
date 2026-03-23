import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",  // ← CHANGED from mysql to postgres
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: Buffer.from(process.env.DB_CA_CERT, "base64").toString("utf-8"),
      },
    },
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Aiven PostgreSQL connected successfully"))
  .catch((err) => console.error("❌ DB connection failed:", err));

export default sequelize;