const config = {
	MONGODB_URI: "mongodb://localhost:27017/AniBook",
	JWT_SECRET: "QW5pQm9vaw==",
	userList: {
		readIt: "readit" /* Прочитано */,
		plan: "plan" /* В планах */,
		read: "read" /* Читаю */,
		postponed: "postponed" /* Отложено */,
	},
};

module.exports = config;
