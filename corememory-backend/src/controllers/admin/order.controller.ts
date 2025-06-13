import { FastifyReply, FastifyRequest } from "fastify";

import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";
import * as functions from "../../utils/functions";
import * as types from "../../utils/types";


export const updateOrder = async (
	request: FastifyRequest<{ Body: types.Order & { order_id: number } }>,
	reply: FastifyReply
) => {
	try {
		const authToken = request.headers["authorization"]?.split(" ")[1];
		const token = await verifyToken(authToken);
		functions.handleDecodedError(token, reply); // Handle the token error

		const { user_id } = token.decodedToken;

		if (!user_id) {
			return reply.send({
				status_code: 401,
				message: "Invalid token or user_id missing",
			});
		}

		const isUserExist = await db.User.findOne({ where: { user_id } });
		if (!isUserExist) {
			return reply.send({
				status_code: 404,
				message: "User not found",
			});
		}

		const { order_id, status, proof_of_delivery, date_time, message} = request.body;

		const order = await db.Order.findByPk(order_id);
		if (!order) {
			return reply.send({
				status_code: 404,
				message: "Order not found",
			});
		}

		const updatedOrder = await order.update({
            status,
            proof_of_delivery,
            date_time: Array.isArray(date_time)
                ? JSON.stringify([...date_time]) // Ensure date_time is an array
                : JSON.stringify([new Date()]), // Default to current date if not an array
        
            message: Array.isArray(message)
                ? JSON.stringify([...message]) // Ensure message is an array
                : JSON.stringify([]), // Default to empty array if not an array
        });
        

		return reply.status(200).send({
			status_code: 200,
			message: "Order updated successfully",
			data: updatedOrder.dataValues,
		});
	} catch (error: any) {
		console.error(error);
		reply.status(500).send({
			status_code: 500,
			message: "Internal server error",
			error: error.message,
		});
	}
};


// * This is for admin controller
export const getAdminAllOrders = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		// TODO: need authentication for admin
		// const authToken = request.headers["authorization"]?.split(" ")[1];

		const all_orders = await db.Order.findAll();
		if (!all_orders) {
			return reply.send({
				status_code: 404,
				message: "Orders not found",
			});
		}

		// console.log(all_orders.map((order: any) => order.dataValues));
		reply.status(200).send({
			status_code: 200,
			message: "Orders retrieved successfully",
			length: all_orders.length,
			data: all_orders,
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