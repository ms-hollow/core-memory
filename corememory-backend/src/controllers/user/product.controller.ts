import { FastifyReply, FastifyRequest } from "fastify";

import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";

export const getProduct = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const authToken = request.headers["authorization"]?.split(" ")[1];
        const token = await verifyToken(authToken);

        if (!token) {
            return reply.send({
                status_code: 404,
                message: "Token not found",
            });
        }

        const products = await db.Product.findAll();

        reply.status(200).send({
            status_code: 200,
            message: "Products retrieved successfully",
            data: products,
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            status_code: 500,
            message: "Internal server error",
            error,
        });
    }
};
