import app from ".";
import config from "./config";

const server = app.listen(config.PORT, () => {
	console.log("Server listening on PORT", config.PORT);
});

export default server;
