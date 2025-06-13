import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { pipeline } from "node:stream/promises";
import path from "path";

import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";
import { BASE_URL } from "../../utils/constant";
import * as functions from "../../utils/functions";
import * as types from "../../utils/types";

export const uploadAttachFile = async (
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

        const parts = request.parts(); // Get the multipart iterator
        const files: any[] = [];
        let title = "";
        let description = "";
        let type = "";

        for await (const part of parts) {
            if (part.type === "field") {
                // Handle regular fields
                if (part.fieldname === "title") {
                    title = part.value as string;
                } else if (part.fieldname === "description") {
                    description = part.value as string;
                } else if (part.fieldname === "type") {
                    type = part.value as string;
                }
            }
            if (part.type === "file") {
                const mimetype = part.mimetype;

                if (
                    !mimetype.startsWith("image/") &&
                    !mimetype.startsWith("video/")
                ) {
                    return reply.send({
                        status_code: 400,
                        message:
                            "Invalid file type. Only images and videos are allowed.",
                    });
                }
                const uploadPath = path.join(
                    __dirname,
                    "../../../uploads",
                    mimetype.startsWith("image/") ? "image" : "video"
                );
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }

                const filename = `${user_id}-${Date.now()}-${part.filename}`;
                const filePath = path.join(uploadPath, filename);

                await pipeline(part.file, fs.createWriteStream(filePath));

                files.push({
                    file_name: part.filename,
                    saved_as: filename,
                    file_type: part.mimetype,
                    path: `uploads/${
                        mimetype.startsWith("image/") ? "image" : "video"
                    }/${filename}`,
                });
            }
            // const fileBuffer = await functions.streamToBuffer(part.file); // Ensure the utility function exists
        }
        const missingFields = ["title", "description", "type"].filter(
            (field) => !eval(field)
        );
        if (missingFields.length) {
            return reply.send({
                status_code: 400,
                message: "All fields are required",
                missing_fields: missingFields,
            });
        }
        if (type !== "file") {
            return reply.send({
                status_code: 400,
                message: "Invalid file type. Only 'file' is allowed.",
            });
        }

        // TODO: connect to aws s3 bucket to generate the qr code

        const core_memory = {
            user_id: user_id,
            attach_item: files[0]?.file_name,
            type: "file",
            title: title,
            description: description,
            generated_qr_code: `${BASE_URL}/${files[0]?.path}`,
        };
        const createdCoreMemory = await db.Core_Memory.create(core_memory);

        return reply.status(201).send({
            status_code: 201,
            message: "Files uploaded successfully",
            data: {
                // core_memory_id: createdCoreMemory.dataValues.core_memory_id,
                type: type,
                title,
                description,
                generated_qr_code: `${BASE_URL}/${files[0]?.path}`,
                attach_item: files,
            },
        });
    } catch (error: any) {
        console.error(error); // Log the error for debugging
        return reply.send({
            status_code: 500,
            message: "Internal server error",
            error: error.message, // Send the error message in the response
        });
    }
};

export const uploadAttachLink = async (
    request: FastifyRequest<{ Body: types.Core_Memory }>,
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

        const missingFields = Object.entries(fields).filter(
            ([key, value]) => !value
        );
        if (missingFields.length > 0 || Object.keys(fields).length === 0) {
            return reply.send({
                status_code: 400,
                message: "All fields are required",
                missing_fields: missingFields.map(([key]) => key),
            });
        }

        const { attach_item, type, title, description } = fields;
        if (!functions.isValidLink(attach_item)) {
            return reply.send({
                status_code: 400,
                message: "Invalid link format",
            });
        }

        if (!["link"].includes(type)) {
            return reply.send({
                status_code: 400,
                message: "Invalid type. Only 'link' are allowed.",
            });
        }

        const core_memory = {
            user_id: user_id,
            attach_item: attach_item,
            type: "link",
            title: title,
            description: description,
            generated_qr_code: attach_item,
        };

        const createdCoreMemory = await db.Core_Memory.create(core_memory);

        return reply.status(201).send({
            status_code: 201,
            message: "Link uploaded successfully",
            data: {
                core_memory_id: createdCoreMemory.dataValues.core_memory_id,
                ...core_memory,
            },
        });
    } catch (error: any) {
        console.error(error); // Log the error for debugging
        return reply.send({
            status_code: 500,
            message: "Internal server error",
            error: error.message, // Send the error message in the response
        });
    }
};

export const deleteCoreMemory = async (
    request: FastifyRequest<{ Querystring: { core_memory_id: number } }>,
    reply: FastifyReply
) => {
    try {
        const { core_memory_id } = request.query;
        const authToken = request.headers["authorization"]?.split(" ")[1];
        const token = await verifyToken(authToken);
        functions.handleDecodedError(token, reply);

        const coreMemory = await db.Core_Memory.findByPk(core_memory_id);

        if (!coreMemory) {
            return reply.send({
                status_code: 404,
                message: "Core memory not found",
            });
        }

        await coreMemory.destroy();

        return reply.status(200).send({
            status_code: 200,
            message: "Core memory deleted successfully",
        });
    } catch (error: any) {
        console.error(error);
        return reply.send({
            status_code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// TODO get core memory details (GET)

export const getCoreMemory = async (
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

        const orders = await db.Order.findAll({
            where: { user_id: user_id },
        });

        const orderDates = orders.map((order: any) => order.order_date);

        const order_details = await db.Order_Detail.findAll({
            where: { user_id: user_id },
        });

        const variant = order_details.map((order: any) => order.variant);

        const all_order_detail_id = order_details.map(
            (order: any) => order.order_detail_id
        );

        console.log(all_order_detail_id);

        const core_memory = await db.Core_Memory.findAll({
            where: { core_memory_id: all_order_detail_id },
        });
        // const coreMemory = await db.Core_Memory.findAll({
        //     where: { user_id: user_id },
        // });

        const coreMemory = core_memory.map(
            (memory: any, index: number) => ({
                ...memory.toJSON(),
                order_date: orderDates[index] || null,
                variant: variant[index] || null,
            })
        );

        return reply.status(200).send({
            status_code: 200,
            message: "Core memory retrieved successfully",
            length: core_memory.length,
            data: coreMemory,
        });
    } catch (error: any) {
        console.error(error); // Log the error for debugging
        return reply.send({
            status_code: 500,
            message: "Internal server error",
            error: error.message, // Send the error message in the response
        });
    }
};
