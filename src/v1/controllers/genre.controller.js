const genreService = require("../services/genre.service");

const getAllGenres = async (req, res) => {
	const resObj = await genreService.getAllGenres();
	return res.json(resObj);
};

module.exports = {
	getAllGenres,
};
