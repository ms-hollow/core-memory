import { FastifyInstance } from "fastify";

import * as productControllers from "../../controllers/user/product.controller";

export default async (fastify: FastifyInstance) => {
    fastify.get("/all-product", productControllers.getProduct);
};
