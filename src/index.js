const express = require("express");
const v1RouterAuth = require("./v1/routes/auth.routes");
const v1RouterUser = require("./v1/routes/user.routes");
const v1RouterStory = require("./v1/routes/story.routes");
const v1RouterGenre = require("./v1/routes/genre.routes");
const v1RouterTag = require("./v1/routes/tag.routes");
const v1RouterReview = require("./v1/routes/review.routes");
const bodyParser = require("body-parser");
// const multer = require("multer");
const dbStart = require("./database/connection");

dbStart().catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", v1RouterAuth);
app.use("/api/v1/user", v1RouterUser);
app.use("/api/v1/story", v1RouterStory);
app.use("/api/v1/genre", v1RouterGenre);
app.use("/api/v1/tag", v1RouterTag);
app.use("/api/v1/review", v1RouterReview);

app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
});
