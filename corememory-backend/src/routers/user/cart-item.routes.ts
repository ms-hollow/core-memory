import { FastifyInstance } from "fastify";

import * as cartItemControllers from "../../controllers/user/cart-item.controller";

export default async (fastify: FastifyInstance) => {
	fastify.post("/add-to-cart", cartItemControllers.addToCart);
	fastify.get("/shopping-cart", cartItemControllers.getAllShoppingCart);
};
