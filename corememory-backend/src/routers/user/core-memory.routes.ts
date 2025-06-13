import { FastifyInstance } from "fastify";

import * as coreMemoryControllers from "../../controllers/user/core-memory.controller";

export default async (fastify: FastifyInstance) => {
    fastify.get(
        "/core-memory",
        coreMemoryControllers.getCoreMemory
    );
    fastify.post(
        "/upload-attachment/file",
        coreMemoryControllers.uploadAttachFile
    );
    fastify.post(
        "/upload-attachment/link",
        coreMemoryControllers.uploadAttachLink
    );
    fastify.delete(
        "/delete-core-memory",
        coreMemoryControllers.deleteCoreMemory
    );
};
