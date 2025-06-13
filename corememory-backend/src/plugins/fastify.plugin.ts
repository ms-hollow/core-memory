import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";
import jwtFastify from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import FastifyMultipart from "@fastify/multipart";
import fp from "fastify-plugin";

import { JWT_SECRET_KEY } from "../utils/constant";

// JWT Fastify Plugin
const JWT = async (fastify: FastifyInstance): Promise<void> => {
	fastify.register(jwtFastify, {
		secret: JWT_SECRET_KEY,
		sign: {
			algorithm: "HS256",
		},
	});
};

// CORS Fastify Plugin
const CORS = async (fastify: FastifyInstance): Promise<void> => {
	fastify.register(cors, {
		origin: true, // put your domain here (change `*` to your domain)
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		credentials: true,
	});
};

const COOKIES = async (fastify: FastifyInstance): Promise<void> => {
	fastify.register(cookie, {
		// secret: COOKIE_SECRET_KEY, // Optional: for signed cookies
		hook: "onRequest",
		parseOptions: {},
	} as FastifyCookieOptions);
};

const fastifyMultipart = async (fastify: FastifyInstance): Promise<void> => {
    fastify.register(FastifyMultipart, {
        limits: {
            fileSize: 100 * 1024 * 1024 * 1024, // 100 GB
        },
    });
};

export const corsFastifyPlugin = fp(CORS);
export const jwtFastifyPlugin = fp(JWT);
export const cookiesFastifyPlugin = fp(COOKIES);
export const fastifyMultipartPlugin = fp(fastifyMultipart);
