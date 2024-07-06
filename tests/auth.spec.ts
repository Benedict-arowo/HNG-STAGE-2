import config from "../config";
import authService from "../services/auth.service";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "..";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

describe("Token Generation", () => {
	const user = {
		id: "12345",
		email: "test@example.com",
		firstName: "John",
		lastName: "Doe",
	};

	it("should generate a token with correct user details", () => {
		const token = authService["generateToken"]({ id: user.id });
		const decoded = jwt.verify(token, config.JWT_KEY);

		expect(decoded).toHaveProperty("id");
		expect((decoded as any).id).toBe(user.id);
	});

	it("should expire the token after 1 hour", () => {
		const token = authService["generateToken"]({ id: user.id });
		const decoded = jwt.verify(token, config.JWT_KEY);

		const now = Math.floor(Date.now() / 1000);
		const expiresIn = (decoded as any).exp - now;

		expect(expiresIn).toBeLessThanOrEqual(3600);
	});
});

describe("Auth Endpoints", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany(); // Clean up test users
		await prisma.organisation.deleteMany(); // Clean up test organisations
		await prisma.organisationOnUser.deleteMany(); // Clean up test organisationOnUser
		await prisma.$disconnect();
	});

	it("should register a user successfully with default organisation", async () => {
		const res = await request(app).post("/api/auth/register").send({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "password123",
			phone: "1234567890",
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("data");
		expect(res.body.data.user).toHaveProperty(
			"email",
			"john.doe@example.com"
		);
		expect(res.body.data.user).toHaveProperty("firstName", "John");
		expect(res.body.data.user).toHaveProperty("lastName", "Doe");
		expect(res.body.data.user).toHaveProperty("phone", "1234567890");
		expect(res.body.data).toHaveProperty("accessToken");
		expect(res.body.data.user).not.toHaveProperty("password");

		const organisations = await prisma.organisationOnUser.findMany({
			where: {
				userId: res.body.data.user.userId,
			},
			select: {
				organisation: {
					select: {
						name: true,
					},
				},
			},
		});

		const exists = organisations.find((org) => {
			return (
				org.organisation.name.toUpperCase() ==
				`${res.body.data.user.firstName}'s Organisation`.toUpperCase()
			);
		});

		expect(exists).toBeTruthy();
	});

	it("should log the user in successfully", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "john.doe@example.com",
			password: "password123",
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("data");
		expect(res.body.data).toHaveProperty("accessToken");
		expect(res.body.data.user).toHaveProperty(
			"email",
			"john.doe@example.com"
		);
	});

	it("should return 422 if firstName is missing", async () => {
		const res = await request(app).post("/api/auth/register").send({
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "password123",
			phone: "1234567890",
		});

		expect(res.statusCode).toBe(422);
		expect(res.body.errors).toBeDefined();
		expect(res.body.errors).toEqual(
			expect.arrayContaining([
				{
					field: "firstName",
					message: "firstName is required",
				},
			])
		);
	});

	it("should return 422 if lastName is missing", async () => {
		const res = await request(app).post("/api/auth/register").send({
			firstName: "John",
			email: "john.doe@example.com",
			password: "password123",
			phone: "1234567890",
		});

		expect(res.statusCode).toBe(422);
		expect(res.body.errors).toBeDefined();
		expect(res.body.errors).toEqual(
			expect.arrayContaining([
				{
					field: "lastName",
					message: "lastName is required",
				},
			])
		);
	});

	it("should return 422 if email is missing", async () => {
		const res = await request(app).post("/api/auth/register").send({
			firstName: "John",
			lastName: "Doe",
			password: "password123",
			phone: "1234567890",
		});

		expect(res.statusCode).toBe(422);
		expect(res.body.errors).toBeDefined();
		expect(res.body.errors).toEqual(
			expect.arrayContaining([
				{
					field: "email",
					message: "email is required",
				},
			])
		);
	});

	it("should return 422 if password is missing", async () => {
		const res = await request(app).post("/api/auth/register").send({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			phone: "1234567890",
		});

		expect(res.statusCode).toBe(422);
		expect(res.body.errors).toBeDefined();
		expect(res.body.errors).toEqual(
			expect.arrayContaining([
				{
					field: "password",
					message: "password is required",
				},
			])
		);
	});

	it("should fail if there’s duplicate email or userId", async () => {
		const userData = {
			firstName: "Jake",
			lastName: "Smith",
			email: "jake.smith@example.com",
			password: "password123",
			phone: "1234567890",
		};

		const res1 = await request(app)
			.post("/api/auth/register")
			.send(userData);

		expect(res1.statusCode).toEqual(201);

		const res2 = await request(app)
			.post("/api/auth/register")
			.send(userData);

		expect(res2.statusCode).toEqual(422);
		expect(res2.body).toHaveProperty("errors", [
			{ field: "email", message: "Email already exists" },
		]);
	});
});
