import express from "express";
import userController from "../controllers/user.controller";
import Authenticated from "../middlewears/authenticated";
const Router = express.Router();

Router.route("/:userId").get(Authenticated, userController.getUser);

export default {
	routeUrl: "users",
	Router,
};
