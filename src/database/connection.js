const mongo = require("mongodb").MongoClient;

const db = mongo.connect("mongodb://localhost:27017", (err, client) => {
	if (err) {
		console.log("Connection error: ", err);
		throw err;
	}

	console.log("Connected to MongoDB");

	client.close();
});

module.exports = db;
