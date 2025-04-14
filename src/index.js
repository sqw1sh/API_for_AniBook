const express = require("express");
const v1RouterUser = require("./v1/routes/user.routes");
const runDB = require("./database/connection");

runDB().catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", v1RouterUser);

app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
});
