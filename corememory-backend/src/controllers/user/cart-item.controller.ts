import { FastifyReply, FastifyRequest } from "fastify";

import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";
import * as functions from "../../utils/functions";
import * as types from "../../utils/types";

export const addToCart = async (
	request: FastifyRequest<{ Body: types.Cart_Item }>,
	reply: FastifyReply
) => {
	try {
		const authToken = request.headers["authorization"]?.split(" ")[1];
		const token = await verifyToken(authToken);
		functions.handleDecodedError(token, reply); // Handle the token error

		const { user_id } = token.decodedToken;

		const isUserExist = await db.User.findOne({ where: { user_id } });
		if (!isUserExist) {
			return reply.send({
				status_code: 404,
				message: "User not found",
			});
		}
		const fields = request.body; // Extract file_type and file_name from the request body

		const { order_detail_id, create_at } = fields;

		const noNullFields = {
			order_detail_id,
			create_at,
		};
		const missingFields = Object.entries(noNullFields).filter(
			([key, value]) => !value
		);
		if (
			missingFields.length > 0 ||
			Object.keys(noNullFields).length === 0
		) {
			return reply.send({
				status_code: 400,
				message: "All fields are required",
				missing_fields: missingFields.map(([key]) => key),
			});
		}
		const isOrderExist = await db.Order_Detail.findByPk(order_detail_id);
		if (!isOrderExist) {
			return reply.send({
				status_code: 404,
				message: "Order not found",
			});
		}

		const isOrderDetailIDExist = await db.Cart_Item.findOne({
			where: { order_detail_id },
		});
		if (isOrderDetailIDExist) {
			return reply.send({
				status_code: 409,
				message: "Order detail id already exists in the cart",
			});
		}
		const data = {
			order_detail_id,
			create_at,
		};
		const createdOrder = await db.Cart_Item.create(data);
		console.log(createdOrder.dataValues);

		reply.status(200).send({
			status_code: 200,
			message: "Order added to cart successfully",
			data: {
				order_detail_id: fields.order_detail_id,
				create_at: fields.create_at,
			},
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

export const getAllShoppingCart = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		const authToken = request.headers["authorization"]?.split(" ")[1];
		const token = await verifyToken(authToken);
		functions.handleDecodedError(token, reply); // Handle the token error

		const { user_id } = token.decodedToken;
		const isUserExist = await db.User.findOne({ where: { user_id } });
		if (!isUserExist) {
			return reply.send({
				status_code: 404,
				message: "User not found",
			});
		}

		const order_details = await db.Order_Detail.findAll({
			where: { user_id: user_id },
		});

		const all_order_detail_id = order_details.map(
			(order: any) => order.order_detail_id
		);
		console.log(all_order_detail_id);
		const shopping_cart = await db.Cart_Item.findAll({
			where: { order_detail_id: all_order_detail_id },
		});

		reply.status(200).send({
			status_code: 200,
			message: "Orders retrieved successfully",
			length: shopping_cart.length,
			data: shopping_cart,
			// data2: order_details
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
