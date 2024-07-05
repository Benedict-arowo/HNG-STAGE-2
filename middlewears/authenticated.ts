import { NextFunction, Request, Response } from "express";
import { BadrequestError } from "./error";
import jwt from "jsonwebtoken";
import config from "../config";
import { USER } from "../prisma/db";

const Authenticated = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token || token.length !== 2) {
		throw new BadrequestError("Invalid token");
	}

	const { userId } = jwt.verify(token, config.JWT_KEY as string) as any;
	console.log(userId);

	if (!userId) throw new BadrequestError("Invalid token");

	const user = await USER.findUniqueOrThrow({ where: { userId } });
	(req as any).user = user;
	next();
};

export default Authenticated;
