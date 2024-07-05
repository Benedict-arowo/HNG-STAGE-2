import { BadrequestError, NotFoundError } from "../middlewears/error";
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

	public getOne = async (orgId: string) => {
		try {
			const org = await ORG.findUniqueOrThrow({
				where: {
					orgId,
				},
			});

			return org;
		} catch (err: any) {
			throw new NotFoundError("Organisation not found.");
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

	public addUser = async (userId: string, orgId: string) => {
		try {
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
