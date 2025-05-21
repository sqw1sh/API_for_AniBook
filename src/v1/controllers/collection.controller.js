const collectionService = require("../services/collection.service");

/* GET */
const getAllCollections = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	const resObj = await collectionService.getAllCollections(page);
	return res.json(resObj);
};

const getOneCollection = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await collectionService.getOneCollection(id);
	return res.json(resObj);
};

const likeCollection = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await collectionService.likeCollection(token, id, req.body);
	return res.json(resObj);
};

/* UPDATE */
const updateCollection = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await collectionService.updateCollection(token, id, req.body);
	return res.json(resObj);
};

/* POST */
const createCollection = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await collectionService.createCollection(token, req.body);
	return res.json(resObj);
};

/* DELETE */
const removeCollection = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await collectionService.removeCollection(token, id);
	return res.json(resObj);
};

module.exports = {
	getAllCollections,
	getOneCollection,
	likeCollection,
	updateCollection,
	createCollection,
	removeCollection,
};
