// src/services/authService.ts
import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../utils/constant";

const SECRET = JWT_SECRET_KEY;

export const signResetToken = (user_id: number, username: string): string => {
	return jwt.sign({ user_id, username }, SECRET, { expiresIn: "10m" });
};

export const verifyResetToken = (token: string): { user_id: number, username:  string } => {
	return jwt.verify(token, SECRET) as { user_id: number, username: string };
};
