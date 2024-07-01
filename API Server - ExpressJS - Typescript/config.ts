require("dotenv").config({ path: "./.env" });

const config: Iconfig = {
	ROUTE_PREFIX: "api",
	NODE_ENV: "development",
	PORT: parseInt(process.env.PORT as string) || 5000,
	DB: {
		HOST: process.env.HOST as string,
		PORT: parseInt(process.env.PORT as string),
		USER: process.env.USER as string,
		PASSWORD: process.env.PASSWORD as string,
		DATABASE: process.env.DATABASE as string,
	},
	CORS_OPTION: {
		origin: process.env.CORS_ORIGIN
			? (process.env.CORS_ORIGIN as string).split("|")
			: ["http://localhost:3000/"],
	},
};

export default config;

interface Iconfig {
	ROUTE_PREFIX?: string;
	NODE_ENV: "development" | "production";
	PORT: number;
	DB: {
		HOST: string;
		PORT: number;
		USER: string;
		PASSWORD: string;
		DATABASE: string;
	};
	CORS_OPTION: {
		origin: string | string[];
	};
}
