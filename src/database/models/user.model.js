const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new Schema(
	{
		login: {
			type: String,
			minLength: 3,
			maxLength: 20,
		},
		email: String,
		password: String,
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

	bcrypt.hash(password, saltRounds, (err, hash) => {
		if (err) {
			console.log(err);
			return;
		}

		this.password = hash;
	});
};

userSchema.methods.checkPassword = function (password) {
	let result = false;

	if (!password) {
		return false;
	}

	if (!this.password) {
		return false;
	}

	bcrypt.compare(password, this.password, (err, res) => {
		if (err) {
			return;
		}

		if (res) {
			result = res;
		}
	});

	return result;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
