const express = require("express");
const v1RouterUser = require("./v1/routes/user.routes");
const db = require("./database/connection");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", v1RouterUser);

app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
});
