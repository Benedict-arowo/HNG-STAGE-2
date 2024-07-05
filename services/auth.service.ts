import config from "../config";
import { BadrequestError, InternalServerError } from "../middlewears/error";
import { USER } from "../prisma/db";
import argon from "argon2";
import jwt from "jsonwebtoken";

class AuthService {
	public login = async ({ email, password }: ILogin) => {
		try {
			const user = await USER.findUniqueOrThrow({
				where: { email },
				select: {
					userId: true,
					firstName: true,
					lastName: true,
					email: true,
					password: true,
					phone: true,
				},
			});

			if (!argon.verify(user.password, password))
				throw new BadrequestError("Authentication failed");

			return {
				accessToken: this.generateToken({ id: user.userId }),
				user: { ...user, password: null },
			};
		} catch (err: any) {
			console.log(err);
			throw new BadrequestError("Authentication failed");
		}
	};

	public register = async ({
		firstName,
		lastName,
		email,
		password,
		phone,
	}: IRegister) => {
		try {
			const hashed_password = await argon.hash(password);
			const user = await USER.create({
				data: {
					email,
					firstName,
					lastName,
					password: hashed_password,
					phone,
					orgs: {
						create: {
							organisation: {
								create: {
									name: `${firstName}'s  Organization`,
									description:
										"This is the default desription, please feel free to change it.",
								},
							},
						},
					},
				},
				select: {
					userId: true,
					firstName: true,
					lastName: true,
					email: true,
					phone: true,
				},
			});

			return {
				accessToken: this.generateToken({ id: user.userId }),
				user,
			};
		} catch (err: any) {
			console.log(err);
			throw new BadrequestError("Registration unsuccessful");
		}
	};

	private generateToken = (payload: any) => {
		const token = jwt.sign(payload, config.JWT_KEY);

		return token;
	};
}

export default new AuthService();

interface ILogin {
	email: string;
	password: string;
}

interface IRegister extends ILogin {
	firstName: string;
	lastName: string;
	phone: string | undefined;
}