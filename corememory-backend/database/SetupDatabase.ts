import { DB_NAME } from "../src/utils/constant";
import { NoDbSequelize as sequelize } from "./Database";

async function setupDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`); // Drop the database if it exists
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`); // Create the database
        await sequelize.close(); // Close the connection
        console.log("Database connected successfully: ", DB_NAME);
    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

setupDatabase();
