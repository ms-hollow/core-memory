import fp from "fastify-plugin";
import { Sequelize } from "sequelize";

const sequelizeAuth = async (fastify: any, opts: {sequelize: Sequelize}) => {
    try {
        await opts.sequelize.authenticate();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:");
    }
};

export default fp(sequelizeAuth);
