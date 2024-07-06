import {
	BadrequestError,
	ForbiddenError,
	NotFoundError,
} from "../middlewears/error";
import { ORG } from "../prisma/db";

class OrgsService {
	public getMany = async (userId: string) => {
		const orgs = await ORG.findMany({
			where: {
				user: {
					some: {
						userId,
					},
				},
			},
		});

		return orgs;
	};

	public getOne = async (orgId: string, user_id: string) => {
		try {
			const org = await ORG.findUniqueOrThrow({
				where: {
					orgId,
				},
				include: {
					user: true,
				},
			});

			if (!org.user.find((user) => user.userId === user_id))
				throw new ForbiddenError(
					"You are not allowed to perform this action."
				);

			return {
				orgId: org.orgId,
				name: org.name,
				description: org.description,
			};
		} catch (err: any) {
			if (err.code === "P2025")
				throw new NotFoundError("Organisation not found.");
			throw new ForbiddenError(
				"You are not allowed to perform this action."
			);
		}
	};
	public create = async ({ name, description, userId }: ICreate) => {
		try {
			const data = await ORG.create({
				data: {
					name,
					description,
					user: {
						create: {
							userId,
						},
					},
				},
			});

			return data;
		} catch (err: any) {
			throw new BadrequestError("Error.");
		}
	};

	public addUser = async (
		userId: string,
		orgId: string,
		activeUser: string
	) => {
		try {
			const org = await ORG.findUniqueOrThrow({
				where: {
					orgId,
				},
				select: {
					user: true,
				},
			});

			if (!org.user.find((user) => user.userId === activeUser))
				throw new BadrequestError(
					"You are not allowed to perform this action."
				);

			const data = await ORG.update({
				where: { orgId: orgId },
				data: {
					user: {
						create: {
							userId,
						},
					},
				},
			});

			return data;
		} catch (err: any) {
			if (err.code == "P2002")
				throw new BadrequestError(
					"User is already a member of the organization."
				);
			throw new BadrequestError("Error.");
		}
	};
}
export default new OrgsService();

interface ICreate {
	name: string;
	description: string;
	userId: string;
}
