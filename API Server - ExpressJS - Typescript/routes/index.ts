import path from "path";
import config from "../config";
import { Express, Router } from "express";
import demoRouter from "./demo.router";
import fs from "fs";

const routelist = <{ default: { routeUrl: string; Router: Router } }[]>[];

const Routes = (app: Express) => {
	const filelist = fs.readdirSync(path.join(__dirname));

	// Importing all router files.
	for (const file of filelist) {
		if (file.includes(".router."))
			routelist.push(require(path.join(__dirname, file)));
	}

	// Routes registration
	routelist.forEach((route) => {
		const { routeUrl, Router } = route.default;
		let prefix = "";

		// Looks for a route prefix eg: (/api/v1)
		if (config.ROUTE_PREFIX) {
			if (config.ROUTE_PREFIX?.startsWith("/"))
				prefix = config.ROUTE_PREFIX;
			else prefix = "/" + config.ROUTE_PREFIX;
		}
		// Constructs the url for the route
		const url = prefix ? prefix + "/" + routeUrl : routeUrl;
		app.use(url, Router);
	});

	console.log(`Successfully imported ${routelist.length} router(s)`);
};

export default Routes;
