import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import path from "path";

import { Op } from "sequelize";
import db from "../../../models/index";
import { verifyToken } from "../../middlewares/authentication.middleware";
import * as authServices from "../../services/authService";
import { BASE_URL } from "../../utils/constant";
import * as functions from "../../utils/functions";
import * as types from "../../utils/types";
// import { authenticate } from "../middlewares/authentication.middleware";
// import { JWT_SECRET_KEY } from "../utils/constant";
// import User from "../../models/user.model";

export const getAllUsersTypes = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		// * Authenticate the user before fetching the todos from the database to ensure that only authenticated users can access the todos.
		const users = await db.User_Type.findAll(); // * Fetch all users from the database and store them in the users variable.
		reply.code(200).send({ status_code: 200, data: users });
	} catch (error) {
		reply.send({
			status_code: 501,
			message: "An error occurred while fetching users types",
			error,
		});
	}
};

export const getAllUsers = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		// * Authenticate the user before fetching the todos from the database to ensure that only authenticated users can access the todos.
		const users = await db.User.findAll(); // * Fetch all users from the database and store them in the users variable.
		reply.code(200).send({ status_code: 200, data: users });
	} catch (error) {
		reply.send({
			status_code: 501,
			message: "An error occurred while fetching users",
			error,
		});
	}
};

/**
 * Registers a new user.
 *
 * @param request - The Fastify request object containing the user data in the body.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves to the response sent to the client.
 *
 * @throws Will send a 501 status code if an error occurs while creating the user.
 */
export const registerUser = async (
	request: FastifyRequest<{ Body: types.User }>,
	reply: FastifyReply
) => {
	try {
		const {
			email,
			username,
			password,
			first_name,
			last_name,
			address,
			city,
			region,
			postal_code,
			contact_number,
			birth_date,
			user_type_id,
			membership_type_id,
		} = request.body;

		const missingFields = Object.entries({
			email,
			username,
			password,
			first_name,
			last_name,
			address,
			city,
			region,
			postal_code,
			contact_number,
			birth_date,
			user_type_id,
			membership_type_id,
		}).filter(([key, value]) => !value);

		if (missingFields.length > 0) {
			return reply.send({
				status_code: 400,
				message: "All fields are required",
				missing_fields: missingFields.map(([key]) => key),
			});
		}

		// check if username is between 6 and 20 characters
		if (username.length < 6 || username.length > 20) {
			return reply.send({
				status_code: 400,
				message: "Username must be between 6 and 20 characters",
			});
		}
		// check if username is exists
		const isUserExist = await db.User.findOne({ where: { username } });
		if (isUserExist) {
			return reply.send({
				status_code: 400,
				message: "Username already exists",
			});
		}

		// check if email exists
		const isEmailExist = await db.User.findOne({ where: { email } });
		if (isEmailExist) {
			return reply.send({
				status_code: 400,
				message: "Email already exists",
			});
		}

		const user = await db.User.create(request.body);

		const token = request.server.jwt.sign(
			{
				user_id: user.user_id,
				username: user.username,
			},
			{
				expiresIn: "1d",
			}
		);
		reply.setCookie("authToken", token, {
			// httpOnly: true,
			// secure: true,
			// sameSite: "none",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day
		});

		return reply.status(201).send({
			status_code: 201,
			message: "User registered successfully",
			data: user,
			token: token,
		});
	} catch (error: any) {
		console.log("Error in registerUser:", error);
		reply.send({
			status_code: 501,
			message: "An error occurred while creating the user",
			error: error.message,
		});
	}
};

/**
 * Logs in a user by verifying their username and password.
 *
 * @param request - The Fastify request object containing the user's login credentials.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A response indicating the result of the login attempt.
 *
 * @throws Will return a 501 status code if an error occurs during the login process.
 */
export const loginUser = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		// TODO token validation expiration: 1 day
		const { username, password } = request.body as {
			username: string;
			password: string;
		};

		const user = await db.User.findOne({ where: { username } });

		if (!user || user.username !== username) {
			return reply.send({
				status_code: 401,
				message: "Username not found",
			});
		}

		// check if password is valid using bcrypt
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return reply.send({
				status_code: 400,
				message: "Invalid password",
			});
		}

		// const token = jwt.sign(
		// 	{
		// 		user_id: user.user_id,
		// 		username: user.username,
		// 	},
		// 	JWT_SECRET_KEY as string, // Replace with your secret key
		// 	{ expiresIn: "1d" }
		// );
		const token = request.server.jwt.sign(
			{
				user_id: user.user_id,
				username: user.username,
			},
			{
				expiresIn: "1d",
			}
		);
		// setTimeout(() => {
		// 	const decoded = request.server.jwt.verify(token);
		// 	console.log("Decoded token:", decoded);
		// }, 2000);

		// set token in cookie
		reply.setCookie("authToken", token, {
			// httpOnly: true, //! remove comment if production
			// secure: true,
			// sameSite: "none",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day
		});

		return reply.status(200).send({
			status_code: 200,
			message: "Login successful",
			token: token,
			data: user,
		});
	} catch (error) {
		return reply.send({
			status_code: 501,
			message: "Error logging in",
			error,
		});
	}
};

export const logoutUser = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const tokenRequest = request.headers["authorization"]?.split(" ")[1];
	const token = await verifyToken(tokenRequest);
	functions.handleDecodedError(token, reply); // Handle the token error
	// if (!tokenRequest) {
	//     return reply
	//         .status(401)
	//         .send({ status_code: 401, error: "Authorization header missing" });
	// }

	reply.clearCookie("authToken", {
		path: "/",
	});

	return reply.send({ message: "Logged out successfully" });
};

export const changePassword = async (
	request: FastifyRequest<{
		Body: {
			current_password: string;
			new_password: string;
			confirm_password: string;
		};
	}>,
	reply: FastifyReply
) => {
	try {
		const authToken = request.headers["authorization"]?.split(" ")[1];
		const token = await verifyToken(authToken);
		functions.handleDecodedError(token, reply); // Handle the token error
		const { user_id } = token.decodedToken;

		// Find the user by user_id
		const user = await db.User.findOne({ where: { user_id } });
		if (!user) {
			return reply.status(404).send({
				status_code: 404,
				message: "User not found",
			});
		}

		const passwordFields = request.body;
		// Validate the input data
		const missingFields = Object.entries(passwordFields).filter(
			([key, value]) => !value
		);
		if (missingFields.length) {
			return reply.status(400).send({
				status_code: 400,
				message: "Missing required fields",
				missing_fields: missingFields,
			});
		}

		const { current_password, new_password, confirm_password } =
			passwordFields;
		// Check if the current password is correct
		const isPasswordValid = await bcrypt.compare(
			current_password,
			user.password
		);
		if (!isPasswordValid) {
			return reply.status(400).send({
				status_code: 400,
				message: "Current password is incorrect",
			});
		}

		if (new_password !== confirm_password) {
			return reply.status(400).send({
				status_code: 400,
				message: "New password and confirm password do not match",
			});
		}

		// Check if the new password is the same as the current password
		const isSamePassword = await bcrypt.compare(
			new_password,
			user.password
		);
		if (isSamePassword) {
			return reply.status(400).send({
				status_code: 400,
				message: "New password cannot be the same as current password",
			});
		}

		user.password = confirm_password; // Update the password field with the new password
		await user.save(); // Save the updated user object to the database

		return reply.status(200).send({
			status_code: 200,
			message: "Password changed successfully",
		});
	} catch (error) {
		console.log("Error in changePassword:", error);
		return reply.send({
			status_code: 501,
			message: "Error changing password",
			error,
		});
	}
};

export const isUsernameAndEmailAvailable = async (
	request: FastifyRequest<{
		Querystring: { username: string; email: string };
	}>,
	reply: FastifyReply
) => {
	try {
		const { username, email } = request.query;

		if (!email) {
			return reply.send({
				status_code: 400,
				message: "Please provide email",
				emailAvailable: "no email",
			});
		}
		if (!username) {
			return reply.send({
				status_code: 400,
				message: "Please provide username",
				usernameAvailable: "no username",
			});
		}

		const isEmailExist = await db.User.findOne({ where: { email } });
		const isUsernameExists = await db.User.findOne({ where: { username } });
		if (isEmailExist && isUsernameExists) {
			return reply.send({
				status_code: 200,
				message: "Email and Username already exists.",
				emailAvailable: false,
				usernameAvailable: false,
				available: false,
				condition: [isEmailExist.email, isUsernameExists.username],
			});
		}

		if (isEmailExist) {
			return reply.send({
				status_code: 400,
				message: "Email already exists",
				emailAvailable: false,
				usernameAvailable: true,
				available: false,
			});
		}
		// console.log("isEmailExist", isEmailExist);

		if (isUsernameExists) {
			return reply.send({
				status_code: 400,
				message: "Username already exists",
				emailAvailable: true,
				usernameAvailable: false,
				available: false,
			});
		}

		return reply.status(201).send({
			status_code: 201,
			message: "Email and Username is available.",
			emailAvailable: true,
			usernameAvailable: true,
			available: true,
		});
	} catch (error) {
		console.log("Error in isUsernameAndEmailAvailable:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while checking username availability.",
			error,
		});
	}
};

export const getUserProfile = async (
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

		const profilePictureUrl = isUserExist.profile_picture
			? `${BASE_URL}/${isUserExist.profile_picture}`
			: null;

		return reply.status(200).send({
			status_code: 200,
			message: "User profile fetched successfully",
			data: {
				...isUserExist.toJSON(),
				profile_picture_url: profilePictureUrl,
			},
		});
	} catch (error) {
		console.log("Error in getUserProfile:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while fetching user profile.",
			error,
		});
	}
};

export const editUserProfile = async (
	request: FastifyRequest<{ Body: types.User }>,
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
		if (isUserExist.username !== request.body.username) {
			return reply.send({
				status_code: 400,
				message: "Username cannot be changed",
			});
		}

		const fields = request.body;
		console.log("fields", fields);
		const { profile_picture, profile_picture_url, ...rest } = fields;
		const noNullFields = {
			...rest,
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

		await db.User.update(fields, { where: { user_id } });

		return reply.status(200).send({
			status_code: 200,
			message: "User profile updated successfully",
			data: fields,
		});
	} catch (error) {
		console.log("Error in editUserProfile:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while updating user profile.",
			error,
		});
	}
};

export const uploadProfilePicture = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const authToken = request.headers["authorization"]?.split(" ")[1];
	const token = await verifyToken(authToken);
	functions.handleDecodedError(token, reply);

	const { user_id } = token.decodedToken;
	const parts = request.parts();
	const uploadPath = path.join(__dirname, "../../../uploads/profile/");

	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	try {
		const user = await db.User.findByPk(user_id);
		const oldImageUrl = user?.profile_picture;

		for await (const part of parts) {
			if (part.type === "file" && part.filename) {
				// Check for valid image file type (jpg, png)
				const allowedTypes = ["image/jpeg", "image/png"];
				if (!allowedTypes.includes(part.mimetype)) {
					return reply.status(400).send({
						status_code: 400,
						message:
							"Unsupported file type. Only JPG and PNG are allowed.",
					});
				}

				const fileName = `${user_id}_${Date.now()}_${part.filename}`;
				const filePath = path.join(uploadPath, fileName);
				const writeStream = fs.createWriteStream(filePath);
				await part.file.pipe(writeStream);

				const imageUrl = `uploads/profile/${fileName}`;

				// Delete old image if it exists
				if (oldImageUrl) {
					const oldImagePath = path.join(
						__dirname,
						"../../",
						oldImageUrl
					);
					if (fs.existsSync(oldImagePath)) {
						fs.unlinkSync(oldImagePath);
					}
				}

				// Update DB
				await db.User.update(
					{ profile_picture: imageUrl },
					{ where: { user_id } }
				);

				// Return the full URL for the image
				return reply.send({
					status_code: 200,
					message: "Profile picture uploaded successfully",
					data: { imageUrl: `${BASE_URL}/${imageUrl}` }, // Full URL
				});
			}
		}
	} catch (error) {
		console.log("Error in uploadProfilePicture:", error);
		return reply.status(500).send({
			status_code: 500,
			message: "Error uploading profile picture",
			error,
		});
	}
};

export const forgotPassword = async (
	request: FastifyRequest<{ Body: { email: string } }>,
	reply: FastifyReply
) => {
	try {
		const { email } = request.body as { email: string };

		if (!email) {
			return reply.status(400).send({
				status_code: 400,
				message: "Email is required",
			});
		}
		if (!functions.emailValidation(email)) {
			return reply.status(400).send({
				status_code: 400,
				message: "Invalid email format",
			});
		}

		const user = await db.User.findOne({ where: { email: email } });

		if (!user) {
			return reply.status(404).send({
				status_code: 404,
				message: "email not found in the database",
			});
		}

		const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
		const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

		await db.Password_Reset.create({
			user_id: user.user_id,
			reset_code: resetCode,
			expires_at: expires,
			used: false,
		});

		await functions.sendResetCode(email, resetCode);

		return reply.status(200).send({
			status_code: 200,
			message: "Reset code sent successfully",
			data: {
				reset_code: resetCode, // ! remove this in production
				expires: expires.toISOString(),
			},
		});
	} catch (error: any) {
		console.log("Error in forgotPassword:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while sending reset password email.",
			error: error.message,
		});
	}
};

export const verifyResetCode = async (
	request: FastifyRequest<{ Body: { email: string; reset_code: string } }>,
	reply: FastifyReply
) => {
	try {
		const fields = request.body;

		const { email, reset_code } = fields;
		const missingFields = Object.entries(fields).filter(
			([key, value]) => !value
		);
		if (missingFields.length > 0) {
			return reply.send({
				status_code: 400,
				message: "All fields are required",
				missing_fields: missingFields.map(([key]) => key),
			});
		}

		if (!functions.emailValidation(email)) {
			return reply.status(400).send({
				status_code: 400,
				message: "Invalid email format",
			});
		}

		const user = await db.User.findOne({ where: { email: email } });
		if (!user) {
			return reply.status(404).send({
				status_code: 404,
				message: "Email not found in the database",
			});
		}

		const resetEntry = await db.Password_Reset.findOne({
			where: {
				user_id: user.user_id,
				reset_code: reset_code,
				used: false,
				expires_at: { [Op.gt]: new Date() },
			},
			order: [["created_at", "DESC"]],
		});

		if (!resetEntry) {
			const errorMessage = resetEntry
				? "Reset code has expired."
				: "Invalid reset code.";
			return reply
				.code(400)
				.send({ status_code: 400, error: errorMessage });
		}

		const token = authServices.signResetToken(user.user_id, user.username);
		reply.setCookie("resetToken", token, {
			// httpOnly: true, //! remove comment if production
			// secure: true,
			// sameSite: "none",
			path: "/",
			maxAge: 60 * 10, // 10 minutes
		});
		return reply.status(200).send({
			status_code: 200,
			message: "Reset code verified successfully",
			resetToken: token,
		});
	} catch (error: any) {
		console.log("Error in verifyResetCode:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while verifying reset code.",
			error: error.message,
		});
	}
};

export const resetPassword = async (
	request: FastifyRequest<{
		Body: { new_password: string; confirm_password: string };
	}>,
	reply: FastifyReply
) => {
	try {
		const resetToken = request.headers["authorization"]?.split(" ")[1];
		const token = await verifyToken(resetToken);
		functions.handleDecodedError(token, reply); // Handle the token error

		const { user_id } = token.decodedToken;

		const user = await db.User.findOne({ where: { user_id } });
		if (!user) {
			return reply.status(404).send({
				status_code: 404,
				message: "User not found",
			});
		}

		const passwordFields = request.body;

		const missingFields = Object.entries(passwordFields).filter(
			([key, value]) => !value
		);
		if (missingFields.length > 0) {
			return reply.send({
				status_code: 400,
				message: "All fields are required",
				missing_fields: missingFields.map(([key]) => key),
			});
		}

		const { new_password, confirm_password } = passwordFields;

		if (new_password !== confirm_password) {
			return reply.status(400).send({
				status_code: 400,
				message: "New password and confirm password do not match",
			});
		}

		const isSamePassword = await bcrypt.compare(
			new_password,
			user.password
		);
		if (isSamePassword) {
			return reply.status(400).send({
				status_code: 400,
				message: "New password cannot be the same as current password",
			});
		}

		user.password = confirm_password; // Update the password field with the new password
		await user.save(); // Save the updated user object to the database

		// Mark the reset code as used
		await db.Password_Reset.update(
			{ used: true },
			{ where: { user_id: user.user_id, used: false } }
		);

		// Clear the reset token cookie
		reply.clearCookie("resetToken", {
			path: "/",
		});

		return reply.status(200).send({
			status_code: 200,
			message: "Password reset successfully",
		});
	} catch (error: any) {
		console.log("Error in resetPassword:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while resetting password.",
			error: error.message,
		});
	}
};

export const resendResetCode = async (
	request: FastifyRequest<{Body: { email: string}}>, // Adjust the type as needed
	reply: FastifyReply
) => {
	try {
        const { email } = request.body;

        if (!email) {
            return reply.status(400).send({
                status_code: 400,
                message: "Email is required",
            });
        }
        if (!functions.emailValidation(email)) {
            return reply.status(400).send({
                status_code: 400,
                message: "Invalid email format",
            });
        }

		const user = await db.User.findOne({ where: { email: email } });
		if (!user) {
			return reply.status(404).send({
				status_code: 404,
				message: "User not found",
			});
		}

		// Check if a reset code already exists for the user
		await db.Password_Reset.update(
			{ used: true },
			{
				where: {
					user_id: user.user_id,
					used: false,
					expires_at: { [Op.gt]: new Date() }, // Check if the reset code is still valid
				},
			}
		);

		const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
		const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

		await db.Password_Reset.create({
			user_id: user.user_id,
			reset_code: resetCode,
			expires_at: expires,
			used: false,
		});

		await functions.sendResetCode(user.email, resetCode);

		return reply.status(200).send({
			status_code: 200,
			message: "Reset code resent successfully",
			data: {
				reset_code: resetCode, // ! remove this in production
				expires: expires.toISOString(),
			},
		});
	} catch (error: any) {
		console.log("Error in resendResetCode:", error);
		return reply.send({
			status_code: 501,
			message: "Error occurred while resending reset code.",
			error: error.message,
		});
	}
};
