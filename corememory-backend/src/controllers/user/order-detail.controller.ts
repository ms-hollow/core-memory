import { FastifyReply, FastifyRequest } from "fastify";

import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";
import * as functions from "../../utils/functions";
import * as types from "../../utils/types";

export const getAllOrderDetails = async (
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
        const orderDetails = await db.Order_Detail.findAll({
            where: { user_id },
        });
        console.log(orderDetails.map((order: any) => order.dataValues));

        reply.status(200).send({
            status_code: 200,
            message: "Order details retrieved successfully",
            length: orderDetails.length,
            data: orderDetails.map((order: any) => order.dataValues),
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            status_code: 500,
            message: "Internal server error",
            error,
        });
    }
}

export const getOrderDetailById = async (
    request: FastifyRequest<{ Params: { order_detail_id: number } }>,
    reply: FastifyReply
) => {
    try {
        const authToken = request.headers["authorization"]?.split(" ")[1];
        const token = await verifyToken(authToken);
        functions.handleDecodedError(token, reply); // Handle the token error

        const { user_id } = token.decodedToken;
        const { order_detail_id } = request.params;

        const isUserExist = await db.User.findOne({ where: { user_id } });
        if (!isUserExist) {
            return reply.send({
                status_code: 404,
                message: "User not found",
            });
        }

        const orderDetail = await db.Order_Detail.findOne({
            where: {
                user_id,
                order_detail_id,
            },
        });

        if (!orderDetail) {
            return reply.status(404).send({
                status_code: 404,
                message: "Order detail not found",
            });
        }

        reply.status(200).send({
            status_code: 200,
            message: "Order detail retrieved successfully",
            data: orderDetail.dataValues,
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


export const createOrderDetail = async (
	request: FastifyRequest<{ Body: types.Order_Details }>,
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
		const { product_id, coupon_id, core_memory_id, variant, quantity } =
			fields;

		const noNullFields = {
			product_id,
			core_memory_id,
			variant,
			quantity,
		};
		const missingFields = Object.entries(noNullFields).filter(
			([key, value]) => !value
		);

		if (missingFields.length > 0) {
			return reply.send({
				status_code: 400,
				message: "All fields are required",
				missing_fields: missingFields.map(([key]) => key),
			});
		}

		const isCoreMemoryExist = await db.Core_Memory.findByPk(core_memory_id);
		if (!isCoreMemoryExist) {
			return reply.send({
				status_code: 404,
				message: "Core memory not found",
			});
		}
		const isCoreMemoryIDExist = await db.Order_Detail.findOne({
			where: { core_memory_id },
		});
		if (isCoreMemoryIDExist) {
			return reply.send({
				status_code: 400,
				message: "Core memory already exists in order detail",
			});
		}

		const isProductExist = await db.Product.findByPk(product_id);
		// console.log(isProductExist.dataValues);
		if (!isProductExist) {
			return reply.send({
				status_code: 404,
				message: "Product not found",
			});
		}
		// * Calculate the total price based on the quantity
		let price_at_purchase = parseFloat(
			(isProductExist.dataValues.price * quantity).toFixed(2)
		);
		let discount_value = 0; // Initialize discount_value with a default value
		// console.log(typeof isProductExist.dataValues);
		const isCouponExist = await db.Coupon.findByPk(coupon_id);
		// console.log(isCouponExist.dataValues);
		if (isCouponExist) {
			const coupon = isCouponExist.dataValues;
			const currentDate = new Date();
			if (coupon.expiration_date < currentDate) {
				return reply.send({
					status_code: 400,
					message: "Coupon expired",
				});
			}
			discount_value = isCouponExist.dataValues.discount_value; // Assign the discount value
			const discountAmount = (price_at_purchase * discount_value) / 100;
			price_at_purchase = parseFloat(
				(price_at_purchase - discountAmount).toFixed(2)
			);
		}
		const data = {
			user_id,
			product_id,
			coupon_id,
			core_memory_id,
			variant,
			quantity,
			discount_value,
			price_at_purchase,
		};

		const createdOrder = await db.Order_Detail.create(data);
		console.log(createdOrder.dataValues);

		return reply.status(201).send({
			status_code: 201,
			message: "Order checked out successfully",
			data: {
				order_detail_id: createdOrder.dataValues.order_detail_id,
				...data,
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

export const deleteOrderDetail = async (
	request: FastifyRequest<{ Querystring: { order_detail_id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { order_detail_id } = request.query;
		const authToken = request.headers["authorization"]?.split(" ")[1];
		const token = await verifyToken(authToken);
		functions.handleDecodedError(token, reply);

		const orderDetail = await db.Order_Detail.findByPk(order_detail_id);
		if (!orderDetail) {
			return reply.status(404).send({
				status_code: 404,
				message: "Order detail not found",
			});
		}

		await db.Order_Detail.destroy({ where: { order_detail_id } });

		return reply.status(200).send({
			status_code: 200,
			message: "Order detail deleted successfully",
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
