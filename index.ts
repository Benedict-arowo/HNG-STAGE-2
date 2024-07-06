import config from "./config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import Routes from "./routes/index";
import ErrorHandler from "./middlewears/error_handler.middlewear";
const app = express();

app.use(morgan("dev"));
app.use(cors(config.CORS_OPTION));
app.use(express.json());

Routes(app);

app.use(ErrorHandler);

export default app;
