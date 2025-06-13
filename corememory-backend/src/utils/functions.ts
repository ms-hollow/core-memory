import dotenv from "dotenv";
import { FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import db from "../../models/index";
import * as types from "../utils/types";
import { JWT_SECRET_KEY } from "./constant";

dotenv.config();

/**
 * Validates whether a given string is a valid URL link.
 *
 * The function checks if the input string matches the pattern of a valid URL,
 * including the protocol (http or https), domain, and optional path/query parameters.
 *
 * @param link - The string to validate as a URL.
 * @returns `true` if the input string is a valid URL, otherwise `false`.
 */
export const isValidLink = (link: string): boolean => {
	const urlRegex = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;
	return urlRegex.test(link);
};

/**
 * Handles errors from a decoded response and sends an appropriate HTTP response.
 *
 * @param data - The decoded data object, which should contain a `success` property
 *               indicating whether the operation was successful, and an `error` property
 *               containing error details if applicable.
 * @param reply - The FastifyReply object used to send the HTTP response.
 *
 * @returns A promise that resolves to an HTTP response with a 401 status code and
 *          an error message if `data.success` is false. Otherwise, no response is sent.
 */
export const handleDecodedError = async (data: any, reply: FastifyReply) => {
	if (!data.success) {
		return reply.status(401).send({
			status_code: 401,
			error: data.error,
			success: false,
		});
	}
};

/**
 * Parses a database URL string and returns a DatabaseConfig object.
 *
 * The database URL should be in the format:
 * `dialect://user:password@host:port/database`
 *
 * @param {string} dbUrl - The database URL to parse.
 * @returns {DatabaseConfig} The parsed database configuration.
 * @throws {Error} If the database URL is not defined or has an invalid format.
 */
export function parseDbUrl(dbUrl: string): types.DatabaseConfig {
	const regex =
		/^(?<dialect>.+):\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:\/]+)(?::(?<port>\d+))?\/(?<database>.+)$/;
	const match = dbUrl.match(regex);

	if (dbUrl === undefined || dbUrl === null) {
		throw new Error("Database URL is not defined");
	}
	if (!match || !match.groups) {
		throw new Error(
			"Invalid database URL format, you need to provide a valid database URL. ex: mysql://user:password@host:port/database_name"
		);
	}

	return {
		DB_DIALECT: match.groups.dialect,
		DB_USER: match.groups.user,
		DB_PASSWORD: match.groups.password,
		DB_HOST: match.groups.host,
		DB_PORT: match.groups.port || "3306", // Default MySQL port
		DB_NAME: match.groups.database,
	};
}

/**
 * Generates a JSON Web Token (JWT) for the provided data.
 *
 * @param data - The payload to be included in the token.
 * @returns A signed JWT string with a 24-hour expiration time.
 *
 * @remarks
 * The token is signed using the `JWT_SECRET_KEY`. Ensure that the secret key
 * is securely stored and not exposed in the codebase.
 */
export const createToken = (data: any) => {
	const token = jwt.sign({ data }, JWT_SECRET_KEY, {
		expiresIn: 24 * 60 * 60 * 1000, // 24 hours
	});
	return token;
};

export const generateOrderReferenceId = async (): Promise<string> => {
	try {
		// Fetch the latest order from the database
		const latestOrder = await db.Order.findOne({
			order: [["order_date", "DESC"]], // Assuming order_date is the timestamp column
		});
		console.log("Latest Order:", latestOrder.dataValues);

		let lastId = 0;

		if (latestOrder && latestOrder.dataValues.order_reference_id) {
			// Extract the numeric part of the last order_reference_id
			const match =
				latestOrder.dataValues.order_reference_id.match(/ORD(\d+)/); // Match numeric part after "ORD"
			if (match) {
				lastId = parseInt(match[1], 10); // Parse the numeric part
			}
		}

		// Increment the last ID and enforce six-digit padding
		const newId = (lastId + 1).toString().padStart(6, "0");

		// Return the new order_reference_id
		return `ORD${newId}`;
	} catch (error) {
		console.error("Error generating order_reference_id:", error);
		throw new Error("Failed to generate order_reference_id");
	}
};

export const emailValidation = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
};

export async function sendResetCode(email: string, code: string) {
	const transporter = nodemailer.createTransport({
		service: process.env.MAIL_SERVICE,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD,
		},
	});

	await transporter.sendMail({
		from: `"Your App" <${process.env.MAIL_USER}>`,
		to: email,
		subject: "Password Reset Code",
		html: `<p>Your reset code is: <strong>${code}</strong><br/>It will expire in 10 minutes.</p>`,
	});
}