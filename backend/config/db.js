import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

fs.writeFileSync("ca.pem", process.env.DB_CA_CERT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: fs.readFileSync("ca.pem"),
      },
    },
    logging: false,
  },
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Aiven MySQL connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed");
    console.error("Host:", process.env.DB_HOST);
    console.error("Port:", process.env.DB_PORT);
    console.error("Error details:", err.message);
  });

export default sequelize;
