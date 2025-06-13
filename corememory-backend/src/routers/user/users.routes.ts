import { FastifyInstance } from "fastify";

import * as userControllers from "../../controllers/user/users.controller";

export default async (fastify: FastifyInstance) => {
	fastify.get("/users", userControllers.getAllUsers);
	fastify.get("/user-types", userControllers.getAllUsersTypes);
	fastify.post("/signup", userControllers.registerUser);
	fastify.post("/login", userControllers.loginUser);
	fastify.post("/logout", userControllers.logoutUser);
	fastify.put("/update-password", userControllers.changePassword);
	fastify.get(
		"/check-availability",
		userControllers.isUsernameAndEmailAvailable
	);
	fastify.get("/profile", userControllers.getUserProfile);
	fastify.put("/edit-profile", userControllers.editUserProfile);
	fastify.post("/upload-profile", userControllers.uploadProfilePicture);
    fastify.post("/forgot-password", userControllers.forgotPassword);
    fastify.post("/verify-reset-code", userControllers.verifyResetCode);
    fastify.post("/reset-password", userControllers.resetPassword);
    fastify.post("/resend-reset-code", userControllers.resendResetCode)
};
