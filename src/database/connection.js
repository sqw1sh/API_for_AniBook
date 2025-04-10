const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const mongoClient = new MongoClient(url);

async function run() {
	try {
		await mongoClient.connect();
		const db = mongoClient.db("AniBook");
		const result = await db.command({ ping: 1 });

		console.log("Connected to MongoDB");
		console.log(result);
	} catch (err) {
		console.log("Error: " + err);
	} finally {
		await mongoClient.close();
		console.log("Close connect");
	}
}

module.exports = run;
