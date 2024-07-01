import express, { Request, Response } from "express";
import Wrapper from "../middlewears/wrapper";
const Router = express.Router();

Router.get(
	"/hello",
	Wrapper(async (req: Request, res: Response) => {
		return res.json({ message: "Hello World!" });
	})
);

export default {
	routeUrl: "",
	Router,
};
