import fastifyStatic from "@fastify/static"; //* Static file serving plugin for Fastify
import Fastify, { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
// import formbody from "@fastify/formbody";
// import helmet from "@fastify/helmet";

// import { NoDbSequelize as sequelize } from "../database/Database"; // without database name
import { sequelize } from "../database/Database"; // with database name

// import sequelizeAuth from "./plugins/sequelizeAuth.plugin";
import * as fastifyPlugins from "./plugins/fastify.plugin";

import { PORT } from "./utils/constant";

import dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({
    logger: false,
    trustProxy: true,
});

// const listeners = ["SIGINT", "SIGTERM"];
// listeners.forEach((signal) => {
//     process.on(signal, async () => {
//         await sequelize.close();
//         await fastify.close();
//         process.exit(0);
//     });
// });

fastify.register(fastifyPlugins.corsFastifyPlugin); // * Register the CORS plugin
fastify.register(fastifyPlugins.jwtFastifyPlugin); // * Register the JWT plugin
fastify.register(fastifyPlugins.cookiesFastifyPlugin); // * Register the cookie plugin
// fastify.register(sequelizeAuth, { sequelize }); // Register the sequelize plugin with the sequelize database connection
fastify.register(fastifyPlugins.fastifyMultipartPlugin); // * Register the multipart plugin

//* Media path
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "uploads"),
    prefix: "/uploads/",
});

/**
 * Dynamically registers all routes from the routers directory.
 * @param {FastifyInstance} fastify - The Fastify instance to register routes on.
 */
const registerRoutes = (fastify: FastifyInstance) => {
    const baseRoutesPath = path.join(__dirname, "./routers");
    const subfolders = ["admin", "user"];

    subfolders.forEach((folder) => {
        const folderPath = path.join(baseRoutesPath, folder);
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach(async (file) => {
                if (file.endsWith(".ts") || file.endsWith(".js")) {
                    const route = await import(path.join(folderPath, file));
                    const prefix = { prefix: `/api/${folder}` };
                    fastify.register(route.default, prefix);
                }
            });
        }
    });

    const routesPath = path.join(__dirname, "./routers");
    fs.readdirSync(routesPath).forEach(async (file) => {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            const route = await import(path.join(routesPath, file));
            const prefix = { prefix: "/api" };
            fastify.register(route.default, prefix);
        }
    });
};
registerRoutes(fastify);

/**
 * Main function to start the Fastify server.
 * It waits for all plugins to be loaded, then starts listening on the specified port.
 */
const main = async () => {
    try {
        await fastify.ready(); // Wait for all plugins to be loaded
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Sync the database models with the database
        await fastify.listen({ port: PORT as number, host: "0.0.0.0" }, () => {
            console.log(`Server listening on port http://localhost:${PORT}`);
        });
    } catch (err) {
        fastify.log.error(err);
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

main();
