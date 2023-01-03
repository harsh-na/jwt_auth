const router = require("express").Router();
const { verify, verifyrole } = require("../src/verifytoken");
const Roles = require("../src/roles");
const User = require("../models/User");
router.get("/", verify, (req, res) => {
	res.send(req.user);
});

router.get("/userdetail", verify, async (req, res) => {
	const userid = req.user._id;
	const user = await User.findOne({ _id: userid });
	if (user) {
		res.send(`${user.username} is logged in`);
	}
});

router.get("/all", verify, verifyrole, async (req, res) => {
	if (req.role == Roles.Admin) {
		try {
			const user = await User.find();
			console.log(user);
			if (user) {
				res.send(user);
			}
		} catch (err) {
			res.status(400).send(err);
		}
	} else {
		res.status(401).send("Higher Authority Required");
	}
});
module.exports = router;
