import { NextFunction, Request, Response } from "express";
import config from "../config";
import ErrorParent from "./error";

const ErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ErrorParent)
		return res.status(err.code).json({
			message: err.message,
			stack: config.NODE_ENV === "development" ? err.stack : null,
		});
	else
		return res.status(500).json({
			message: err.message,
			stack: config.NODE_ENV === "development" ? err.stack : null,
		});
};

export default ErrorHandler;
