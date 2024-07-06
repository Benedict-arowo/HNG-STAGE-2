import request from "supertest";
import app from "..";
import { PrismaClient } from "@prisma/client";
import authService from "../services/auth.service";

const prisma = new PrismaClient();
describe("Organisation Access", () => {
	let userToken: string;
	let otherUserToken: string;
	let orgId: string;

	beforeAll(async () => {
		// Create a user and generate a token for them
		const user = await prisma.user.create({
			data: {
				userId: "user1",
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@test.com",
				password: "hashedPassword1",
				phone: "1234567890",
			},
		});
		userToken = authService["generateToken"]({ id: user.userId });

		// Create another user and generate a token for them
		const otherUser = await prisma.user.create({
			data: {
				userId: "user2",
				firstName: "Jane",
				lastName: "Smith",
				email: "jane.smith@test.com",
				password: "hashedPassword2",
				phone: "0987654321",
			},
		});
		otherUserToken = authService["generateToken"]({ id: otherUser.userId });

		// Create an organisation and associate it with the first user
		const organisation = await prisma.organisation.create({
			data: {
				orgId: "org1",
				name: "John's Organisation",
				description: "John's default organisation",
				user: {
					create: {
						userId: user.userId,
					},
				},
			},
		});
		orgId = organisation.orgId;
	});

	afterAll(async () => {
		await prisma.organisation.deleteMany();
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	it("should allow a user to access their own organisations", async () => {
		const res = await request(app)
			.get(`/api/organisations/${orgId}`)
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.data.orgId).toBe(orgId);
	});

	it("should not allow a user to access organisations they do not belong to", async () => {
		const res = await request(app)
			.get(`/api/organisations/${orgId}`)
			.set("Authorization", `Bearer ${otherUserToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe(
			"You are not allowed to perform this action."
		);
	});
});
