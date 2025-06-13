import { Sequelize } from "sequelize";

import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from "../src/utils/constant";

import dotenv from "dotenv";
dotenv.config();

type ValidDialect = "mysql" | "postgres" | "sqlite" | "mssql";
// const isTestEnv = process.env.NODE_ENV === "test";

// Check if all required environment variables are set
const requiredEnvVars = [
    {
        DB_HOST: DB_HOST,
        DB_NAME: DB_NAME,
        DB_USER: DB_USER,
        DB_PASSWORD: DB_PASSWORD,
        DB_PORT: DB_PORT,
        DB_DIALECT: DB_DIALECT,
    },
];
requiredEnvVars.forEach((envVarObject) => {
    Object.entries(envVarObject).forEach(([key, value]) => {
        if (value === undefined) {
            // console.log(`Missing environment variable: ${key}`);
            throw new Error(`Missing environment variable: ${key}`);
        }
    });
});

// With database name
export const sequelize = new Sequelize({
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: `${DB_NAME}`,
    port: +DB_PORT,
    dialect: `${DB_DIALECT}` as ValidDialect,
    logging: false,
    storage: "",
});

// Without database name
export const NoDbSequelize = new Sequelize({
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    port: +DB_PORT!,
    dialect: `${DB_DIALECT}` as ValidDialect,
    logging: false,
});
