const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../src/validation.js");
const { expression, valid } = require("@hapi/joi");

router.post("/register", async (req, res) => {
	try {
		// Data validation
		const { error } = registerValidation(req.body);
		if (error) return res.status(400).send(error.details);

		// Check if user exist
		const emailExist = await User.findOne({ emailid: req.body.emailid });

		if (emailExist) return res.status(400).send("Email already exist");
		// Create new user
		var salt = await bcrypt.genSalt(10);
		const hashpass = await bcrypt.hash(req.body.password, salt);

		const user = new User({
			username: req.body.username,
			password: hashpass,
			emailid: req.body.emailid,
			role: req.body.role || null,
		});

		const savedUser = await user.save();
		res.send({ userid: savedUser._id });

		getAll().then((all) => {
			console.log("all the data");
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		//login Validation
		const { error } = loginValidation(req.body);
		if (error) return res.status(400).send(error.details);

		const email = req.body.emailid;
		const password = req.body.password;

		// Check if user exist
		const user = await User.findOne({ emailid: email });
		if (!user) return res.status(400).send("User doesn't exist");

		// get stored hash pass
		const validPass = await bcrypt.compare(password, user.password);
		if (!validPass) return res.status(400).send("Password not correct");

		const jwt_content = {
			_id: user._id,
			_role: user.role,
			status: {
				code: 1,
				lastlogin: Date.now(),
			},
		};
		// create and assign jwt
		const token = jwt.sign(jwt_content, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.header("token", token);
		res.cookie("token", token, {
			expires: new Date(Date.now() + 604800000),
			secure: false, // set to true if your using https
			httpOnly: true,
		});
		res.send("Logged in!");
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get("/logout", (req, res) => {
	try {
		res.clearCookie("token");
		res.send("Logged out!");
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
