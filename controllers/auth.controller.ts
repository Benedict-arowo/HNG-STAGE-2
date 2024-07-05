import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service";
import Wrapper from "../middlewears/wrapper";
import validator from "../middlewears/validators";
import {
	loginSchema,
	registerSchema,
} from "../middlewears/validators/auth.validator";

class AuthController {
	public login = Wrapper(async (req: Request, res: Response) => {
		validator(loginSchema, req.body);
		const { email, password } = req.body;
		const user = await authService.login({ email, password });

		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "Login successful",
			data: user,
		});
	});

	public register = Wrapper(async (req: Request, res: Response) => {
		validator(registerSchema, req.body);
		const { firstName, lastName, email, phone, password } = req.body;
		const user = await authService.register({
			firstName,
			lastName,
			email,
			phone,
			password,
		});

		return res.status(StatusCodes.CREATED).json({
			status: "success",
			message: "Registration successful",
			data: user,
		});
	});
}

export default new AuthController();
