import app from "./app";

app.listen(
	{ port: process.env.SERVER_PORT, host: process.env.SERVER_ADDRESS },
	async function (err) {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`server listening on `, app.server.address());
	}
);
