const express = require("express");
const v1RouterUser = require("./v1/routes/user.routes");
const bodyParser = require("body-parser");
// const multer = require("multer");
const dbStart = require("./database/connection");

dbStart().catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/user", v1RouterUser);

app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
});
