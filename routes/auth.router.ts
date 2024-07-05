import express, { Request, Response } from "express";
import authController from "../controllers/auth.controller";
const Router = express.Router();

Router.post("/register", authController.register);

Router.post("/login", authController.login);

export default {
	routeUrl: "auth",
	Router,
};
