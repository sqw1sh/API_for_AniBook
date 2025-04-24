const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default: "images/avatar/default.png",
		},
		about: {
			type: String,
			default: "",
		},
		socials: {
			vkId: {
				type: String,
				default: "",
			},
			tgId: {
				type: String,
				default: "",
			},
			shikiId: {
				type: String,
				default: "",
			},
		},
		notify: {
			notifyUpdate: {
				type: Boolean,
				default: true,
			},
			notifySubscribe: {
				type: Boolean,
				default: true,
			},
			notifyComment: {
				type: Boolean,
				default: true,
			},
		},
		refreshToken: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.setPassword = function (password) {
	if (!password) {
		return false;
	}

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	this.passwordHash = hash;
};

userSchema.methods.checkPassword = function (password) {
	let result = false;

	if (!password) {
		return false;
	}

	if (!this.passwordHash) {
		return false;
	}

	bcrypt.compare(password, this.passwordHash, (err, res) => {
		if (err) {
			return;
		}

		result = res;
	});

	return result;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
