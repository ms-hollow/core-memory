import { FastifyInstance } from "fastify";

import * as fastifyPlugins from "../plugins/fastify.plugin";

const fastify: FastifyInstance = require("fastify")();
fastify.register(fastifyPlugins.jwtFastifyPlugin); // Register the JWT plugin

export async function verifyToken(token: any): Promise<any> {
	try {
		await fastify.ready(); // Ensure the Fastify instance is ready
		const decoded = fastify.jwt.verify(token); // Verifies the token and decodes it
		// console.log("Decoded token:", decoded); // If valid, the decoded token will be logged
		return { decodedToken: decoded, success: true }; // Return the decoded token if verification is successful
	} catch (err: any) {
		console.log("Token verification failed:", err); // Log the error message
		if (err.name === "TokenExpiredError") {
			console.log("Token has expired.");
			return {error: "token has expired", success: false}; // Return a message if the token has expired
		} else {
			console.log("Token verification failed:", err.message);
			return {error: err.message, success: false}; // Return the error message if verification fails
		}
	}
}

// Call the function with the token
// verifyToken(token);
