const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");

async function start() {
	await mongoose.connect(MONGODB_URI);
}

module.exports = start;
