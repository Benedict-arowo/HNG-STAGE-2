import { BadrequestError } from "../middlewears/error";
import { USER } from "../prisma/db";

class userService {
	/**
	 * Retrieves user data based on the provided userId and activeUserId.
	 * Throws an error if the user is not found.
	 *
	 * @param {string} userId - The ID of the user to retrieve.
	 * @param {string} activeUserId - The ID of the active user.
	 * @returns {Promise<User>} - The user data.
	 * @throws {BadrequestError} - If the user is not found.
	 */
	public getUser = async (userId: string, activeUserId: string) => {
		const user = await USER.findUniqueOrThrow({
			where: { userId: activeUserId },
			select: {
				orgs: {
					select: {
						organisation: {
							select: {
								user: true,
							},
						},
					},
				},
			},
		});

		// Check if the requested user is in any of the organizations the requesting user belongs to
		if (
			!user.orgs.find((org) =>
				org.organisation.user.some((user) => user.userId == userId)
			)
		)
			throw new BadrequestError(
				"You are not authorized to view this user record"
			);

		const data = await USER.findUniqueOrThrow({
			where: {
				userId: activeUserId,
			},
			select: {
				userId: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true,
			},
		});

		return data;
	};
}

export default new userService();
