const ReviewModel = require("../../database/models/review/review.model");
const ReviewLikeModel = require("../../database/models/review/reviewLike.model");
const UserModel = require("../../database/models/user/user.model");
const StoryModel = require("../../database/models/story/story.model");

/* GET */
const getAllReviews = async (page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
	}

	const reviews = await ReviewModel.find({}).skip(offset).limit(max).exec();

	const resReviews = [];

	if (reviews && reviews.length > 0) {
		for (let i = 0; i < reviews.length; i++) {
			const user = await UserModel.findById(reviews[i].userId).exec();
			const story = await StoryModel.findById(reviews[i].storyId).exec();

			if (user && story) {
				resReviews.push({
					user: {
						id: user._id,
						username: user.username,
						image: user.image,
					},
					story: {
						id: story._id,
						title: story.title,
						image: story.image,
					},
					review: {
						id: reviews[i]._id,
						title: reviews[i].title,
					},
				});
			} else {
				continue;
			}
		}
	}

	return {
		page: page,
		reviews: resReviews,
	};
};

module.exports = {
	getAllReviews,
};
