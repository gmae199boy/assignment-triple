import app from "./app";

// export default app.listen(process.env.SERVER_PORT, process.env.SERVER_ADDRESS, async function () {
// 	console.log(process.env.SERVER_ADDRESS);
// 	console.log(process.env.SERVER_PORT);
// 	console.log(`server listening on`, app.server.address());
// });

// const start = async () => {
// 	try {
// 		await app.listen({ port: process.env.SERVER_PORT, host: process.env.SERVER_ADDRESS });
// 	} catch (err) {
// 		app.log.error(err);
// 		process.exit(1);
// 	}
// };

// const start = async () => {
// 	try {
// 		await app.listen({ port: 3000 });
// 	} catch (err) {
// 		app.log.error(err);
// 		process.exit(1);
// 	}
// };

// start();
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
