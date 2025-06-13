import { FastifyInstance } from "fastify";

import * as orderDetailControllers from "../../controllers/user/order-detail.controller"

export default async (fastify: FastifyInstance) => {
    fastify.get(
        "/all-order-detail",
        orderDetailControllers.getAllOrderDetails
    );
	fastify.get(
        "/user/order-detail/:order_detail_id",
        orderDetailControllers.getOrderDetailById
    );
	fastify.post(
		"/create-order-detail",
		orderDetailControllers.createOrderDetail
	);
	fastify.delete(
		"/delete-order-detail",
		orderDetailControllers.deleteOrderDetail
	);
};
