import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import orgsService from "../services/orgs.service";
import Wrapper from "../middlewears/wrapper";
import validator from "../middlewears/validators";
import {
	addUserSchema,
	createOrgsSchema,
} from "../middlewears/validators/orgs.validator";

class OrgsController {
	public getAll = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { userId },
		} = req as any;
		const orgs = await orgsService.getMany(userId);
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "Organizations retrieved successfully",
			data: {
				organisations: orgs,
			},
		});
	});

	public createOrganisation = Wrapper(async (req: Request, res: Response) => {
		const {
			body: { name, description },
			user: { userId },
		} = req as any;
		validator(createOrgsSchema, req.body);
		const org = await orgsService.create({ name, description, userId });

		res.status(StatusCodes.CREATED).json({
			status: "success",
			message: "Organisation created successfully",
			data: org,
		});
	});

	public getOrganisation = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { orgId },
		} = req as any;

		const org = await orgsService.getOne(orgId, (req as any).user.userId);

		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "Organization retrieved successfully",
			data: org,
		});
	});

	public addUser = Wrapper(async (req: Request, res: Response) => {
		// adds a user to a particular organisation [PROTECTED]
		const {
			body: { userId },
			params: { orgId },
		} = req;
		validator(addUserSchema, req.body);
		await orgsService.addUser(userId, orgId);

		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "User added to organisation successfully",
		});
	});
}

export default new OrgsController();
