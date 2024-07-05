import express from "express";
import orgsController from "../controllers/orgs.controller";
import Authenticated from "../middlewears/authenticated";
const Router = express.Router();

Router.route("/")
	.get(Authenticated, orgsController.getAll)
	.post(Authenticated, orgsController.createOrganisation);
Router.route("/:orgId").get(Authenticated, orgsController.getOrganisation);
Router.route(":orgId/users").post(Authenticated, orgsController.addUser);

export default {
	routeUrl: "organisations",
	Router,
};
