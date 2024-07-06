import { Request, Response } from "express";
import userService from "../services/user.service";
import Wrapper from "../middlewears/wrapper";
import validator from "../middlewears/validators";

class userController {
	public getUser = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { userId },
			user: { userId: activeUserId },
		} = req as any;

		const data = await userService.getUser(userId, activeUserId);

		return res.status(200).json({
			status: "success",
			message: "User retrieved successfully",
			data,
		});
	});
}

export default new userController();
