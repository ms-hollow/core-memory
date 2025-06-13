// /src/const/constant.ts

import dotenv from "dotenv";
import * as functions from "./functions"
dotenv.config();

// export const NODE_ENV = ''.toUpperCase()
export const NODE_ENV = (process.env.NODE_ENV || "").toUpperCase();
export const PORT = process.env.BACKEND_PORT || 4000;

const db_url = process.env[`${NODE_ENV}_DB_URL`];
if (!db_url) {
	throw new Error(`Database URL for environment ${NODE_ENV} is not defined`);
}
let parsedDbUrl = functions.parseDbUrl(db_url);
// console.log(NODE_ENV, parsedDbUrl);

export const DB_HOST = parsedDbUrl.DB_HOST;
export const DB_NAME = parsedDbUrl.DB_NAME;
export const DB_USER = parsedDbUrl.DB_USER;
export const DB_PASSWORD = parsedDbUrl.DB_PASSWORD;
export const DB_PORT = parsedDbUrl.DB_PORT;
export const DB_DIALECT = parsedDbUrl.DB_DIALECT;
export const DB_TIMEZONE = process.env[`${NODE_ENV}_DB_TIMEZONE`];

export const JWT_SECRET_KEY = process.env[`${NODE_ENV}_JWT_SECRET_KEY`] || "";
export const COOKIE_SECRET_KEY = process.env[`${NODE_ENV}_COOKIES_SECRET_KEY`] || "";

export const BASE_URL = "http://localhost" + ":" + PORT;