import { FastifyInstance } from "fastify";

import * as orderControllers from "../../controllers/user/order.controller";

export default async (fastify: FastifyInstance) => {
    fastify.get("/all-order", orderControllers.getUserAllOrders);
    fastify.get("order/:order_id", orderControllers.getUserOrderById);
    fastify.post("create-order", orderControllers.createOrder);
    fastify.delete("delete-order", orderControllers.deleteOrder);
    fastify.delete("delete-order/:order_id", orderControllers.deleteOrderById);
    fastify.put("update-order", orderControllers.updateOrder);

    fastify.get("/track-order", orderControllers.getTrackOder);
};
