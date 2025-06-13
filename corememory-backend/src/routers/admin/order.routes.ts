import { FastifyInstance } from "fastify";

import * as orderControllers from "../../controllers/admin/order.controller";

export default async (fastify: FastifyInstance) => {
	fastify.put("/update-order", orderControllers.updateOrder);

	fastify.get("/all-order", orderControllers.getAdminAllOrders);
};