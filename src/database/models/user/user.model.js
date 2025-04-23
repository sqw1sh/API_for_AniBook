const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
	{
		login: {
			type: String,
			minLength: 3,
			maxLength: 20,
		},
		email: String,
		passwordHash: String,
		refreshToken: String,
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
