import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import orgsService from "../services/orgs.service";
import Wrapper from "../middlewears/wrapper";

class OrgsController {
	public getAll = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { userId },
		} = req as any;
		// gets all your organisations the user belongs to or created. If a user is logged in properly, they can get all their organisations. They should not get another user’s organisation [PROTECTED].
		const orgs = await orgsService.getMany(userId);

		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "<message>",
			data: {
				organisations: [
					{
						orgId: "string",
						name: "string",
						description: "string",
					},
				],
			},
		});
	});

	public createOrganisation = Wrapper(async (req: Request, res: Response) => {
		const {
			body: { name, description },
			user: { userId },
		} = req as any;
		const org = await orgsService.create({ name, description, userId });

		res.status(StatusCodes.CREATED).json({
			status: "success",
			message: "Organisation created successfully",
			data: org,
			// data: {
			// 	orgId: "string",
			// 	name: "string",
			// 	description: "string",
			// },
		});
		// : a user can create their new organisation [PROTECTED].
	});

	public getOrganisation = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { orgId },
		} = req as any;

		const org = await orgsService.getOne(orgId);
		// the logged in user gets a single organisation record [PROTECTED]

		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "<message>",
			data: {
				orgId: "string",
				name: "string",
				description: "string",
			},
		});
	});

	public addUser = Wrapper(async (req: Request, res: Response) => {
		// adds a user to a particular organisation [PROTECTED]
		const {
			body: { userId },
			params: { orgId },
		} = req;

		await orgsService.addUser(userId, orgId);

		return res.status(StatusCodes.OK).json({
			status: "success",
			message: "User added to organisation successfully",
		});
	});
}

export default new OrgsController();
