const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");

async function run() {
	await mongoose.connect(MONGODB_URI);
}

module.exports = run;
