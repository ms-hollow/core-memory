import { FastifyReply, FastifyRequest } from "fastify";

import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";
import * as functions from "../../utils/functions";
import * as types from "../../utils/types";

export const getUserAllOrders = async (
    request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
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

        // Extract pagination parameters
        const page = parseInt(request.query.page as any) || 1; // Default to page 1
        const limit = parseInt(request.query.limit as any) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit;

        // Fetch orders with pagination
        const { rows: orders, count: totalOrders } =
            await db.Order.findAndCountAll({
                where: { user_id: user_id },
                limit,
                offset,
            });

        const all_orders = orders.map((order: any) => order.dataValues);

        reply.status(200).send({
            status_code: 200,
            message: "Orders retrieved successfully",
            length: all_orders.length,
            total: totalOrders,
            current_page: page,
            total_pages: Math.ceil(totalOrders / limit),
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

export const getUserOrderById = async (
    request: FastifyRequest<{ Params: { order_id: number } }>,
    reply: FastifyReply
) => {
    try {
        const authToken = request.headers["authorization"]?.split(" ")[1];
        const token = await verifyToken(authToken);
        functions.handleDecodedError(token, reply);

        const { user_id } = token.decodedToken;
        const { order_id } = request.params;

        const isUserExist = await db.User.findOne({ where: { user_id } });
        if (!isUserExist) {
            return reply.send({
                status_code: 404,
                message: "User not found",
            });
        }

        const order = await db.Order.findOne({
            where: { user_id, order_id },
        });

        if (!order) {
            return reply.status(404).send({
                status_code: 404,
                message: "Order not found",
            });
        }

        reply.status(200).send({
            status_code: 200,
            message: "Order retrieved successfully",
            data: order.dataValues,
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

export const createOrder = async (
    request: FastifyRequest<{ Body: types.Order }>,
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

        const fields = request.body;
        const {
            order_detail_id,
            payment_method_id,
            full_name,
            full_address,
            contact_number,
        } = fields;

        const noNullFields = {
            order_detail_id,
            full_name,
            full_address,
            contact_number,
        };

        const missingFields = Object.entries(noNullFields).filter(
            ([key, value]) => value === null || value === undefined
        );

        if (missingFields.length > 0) {
            return reply.send({
                status_code: 400,
                message: "All fields are required",
                missing_fields: missingFields.map(([key]) => key),
            });
        }

        const isOrderDetailExist = await db.Order_Detail.findByPk(
            order_detail_id
        );
        if (!isOrderDetailExist) {
            return reply.send({
                status_code: 404,
                message: "Order detail not found",
            });
        }

        const existingOrder = await db.Order.findOne({
            where: { order_detail_id },
        });
        if (existingOrder) {
            return reply.send({
                status_code: 400,
                message: "Order already exists",
            });
        }

        const order_reference_id = await functions.generateOrderReferenceId();
        console.log(order_reference_id);

        let price_at_purchase = isOrderDetailExist.dataValues.price_at_purchase;

        let shipping_fee = 0; // !for now 0, but later it will be calculated based on the location and product
        let total_amount_no_tax = price_at_purchase + shipping_fee;
        const tax = 0.12; // !for now 0, but later it will be calculated based on the location and product
        const vat = total_amount_no_tax * tax;
        const total_amount_tax = total_amount_no_tax + vat;

        const data = {
            user_id,
            order_detail_id,
            payment_method_id,
            full_name,
            full_address,
            contact_number,
            expected_delivery_start: new Date(
                new Date().setDate(new Date().getDate() + 1)
            ), // 1 day from now
            expected_delivery_end: new Date(
                new Date().setDate(new Date().getDate() + 7)
            ), // 7 days from now
            order_date: new Date(),
            order_reference_id: order_reference_id,
            total_amount: total_amount_tax,
            proof_of_delivery: null,
            status: "Order Placed",
            date_time: JSON.stringify([new Date()]),
            message: JSON.stringify(["Order is placed."]),
            shipping_fee: 0, //! for now 0, but later it will be calculated based on the location and product,
            vat: vat,
        };

        const createOrder = await db.Order.create(data);
        console.log(createOrder.dataValues);

        return reply.status(201).send({
            status_code: 201,
            message: "Order created successfully",
            data: data,
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

export const deleteOrder = async (
    request: FastifyRequest<{ Querystring: { order_id: number } }>,
    reply: FastifyReply
) => {
    try {
        const { order_id } = request.query;

        // Find the order by ID
        const order = await db.Order.findByPk(order_id);
        if (!order) {
            return reply.send({
                status_code: 404,
                message: "Order not found",
            });
        }

        // Find the associated order detail
        const orderDetail = await db.Order_Detail.findByPk(
            order.order_detail_id
        );
        if (!orderDetail) {
            return reply.send({
                status_code: 404,
                message: "Order detail not found",
            });
        }

        // Find the associated core memory
        const coreMemory = await db.Core_Memory.findByPk(
            orderDetail.core_memory_id
        );
        if (!coreMemory) {
            return reply.send({
                status_code: 404,
                message: "Core memory not found",
            });
        }

        await coreMemory.destroy(); // Delete the core memory
        await orderDetail.destroy(); // Delete the order detail
        await order.destroy(); // Delete the order

        return reply.send({
            status_code: 200,
            message:
                "Order, order detail, and core memory deleted successfully",
        });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({
            status_code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const deleteOrderById = async (
    request: FastifyRequest<{ Params: { order_id: number } }>,
    reply: FastifyReply
) => {
    try {
        const { order_id } = request.params;

        const order = await db.Order.findByPk(order_id);
        if (!order) {
            return reply.status(404).send({
                status_code: 404,
                message: "Order not found",
            });
        }

        await order.destroy(); // Only delete the order

        return reply.send({
            status_code: 200,
            message: "Order deleted successfully",
        });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({
            status_code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// TODO: get order details (GET)
// TODO: get order confirmation (GET)

export const getTrackOder = async (
    request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
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

        // Extract pagination parameters
        const page = parseInt(request.query.page as any) || 1; // Default to page 1
        const limit = parseInt(request.query.limit as any) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit;

        // Fetch orders with pagination
        const { rows: orders, count: totalOrders } =
            await db.Order.findAndCountAll({
                where: { user_id: user_id },
                limit,
                offset,
            });

        const all_orders = orders.map((order: any) => order.dataValues);

        const order_detail_id = orders.map(
            (order: any) => order.dataValues.order_detail_id
        );

        console.log(order_detail_id);
        const orderDetails = await db.Order_Detail.findAll({
            where: { order_detail_id },
        });

        const orderDetailsData = orderDetails.map(
            (orderDetail: any) => orderDetail.dataValues
        );

        const product_id = orderDetails.map(
            (orderDetail: any) => orderDetail.dataValues.product_id
        );

        const productInfo = await db.Product.findAll({ where: { product_id } });

        const productInfoData = productInfo.map(
            (productInfo: any) => productInfo.dataValues
        );

        const combinedOrders = all_orders.map((order: any) => {
            const orderDetail = orderDetailsData.find(
                (detail: any) =>
                    detail.order_detail_id === order.order_detail_id
            );

            const product = productInfoData.find(
                (product: any) => product.product_id === orderDetail?.product_id
            );

            return {
                ...order,
                item_orders: {
                    price_at_purchase: orderDetail?.price_at_purchase,
                    product_name: product.product_name,
                    product_image: product.product_image,
                    variant: orderDetail?.variant,
                    quantity: orderDetail?.quantity,
                    product_price: product.price,
                },
            };
        });

        reply.status(200).send({
            status_code: 200,
            message: "Orders retrieved successfully",
            length: combinedOrders.length,
            total: totalOrders,
            current_page: page,
            total_pages: Math.ceil(totalOrders / limit),
            data: combinedOrders,
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

        const { order_id, status, proof_of_delivery, payment_method_id } =
            request.body;

        const order = await db.Order.findByPk(order_id);
        if (!order) {
            return reply.send({
                status_code: 404,
                message: "Order not found",
            });
        }

        // const updatedOrder = await order.update({
        //     status,
        //     proof_of_delivery,
        // });

        const updateData: any = {};
        if ("status" in request.body) updateData.status = status;
        if ("proof_of_delivery" in request.body)
            updateData.proof_of_delivery = proof_of_delivery;
        if ("payment_method_id" in request.body)
            updateData.payment_method_id = payment_method_id;

        if (Object.keys(updateData).length === 0) {
            return reply.send({
                status_code: 400,
                message: "No valid fields provided to update",
            });
        }

        const updatedOrder = await order.update(updateData);

        return reply.status(200).send({
            status_code: 200,
            message: "Order updated successfully",
            data: updatedOrder.dataValues,
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
