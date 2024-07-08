import { NextFunction, Request, Response } from "express";
import { BadrequestError, UnauthorizedError } from "./error";
import jwt from "jsonwebtoken";
import config from "../config";
import { USER } from "../prisma/db";

const Authenticated = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers["authorization"]?.split(" ")[1];

		if (!token) return next(new UnauthorizedError("Invalid token"));
		const { id: userId } = jwt.verify(
			token,
			config.JWT_KEY as string
		) as any;

		if (!userId) return next(new UnauthorizedError("Invalid token"));
		console.log(userId);

		const user = await USER.findUniqueOrThrow({ where: { userId } });
		(req as any).user = user;
		next();
	} catch (err: any) {
		return next(new UnauthorizedError("Unauthorized"));
	}
};

export default Authenticated;
