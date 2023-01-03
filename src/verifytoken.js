const jwt = require("jsonwebtoken");

async function verify(req, res, next) {
	const token = req.cookies.token || "";
	try {
		if (!token) {
			return res.status(401).json("You need to Login");
		}
		const verified = await jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		console.group(verified);
		next();
	} catch (err) {
		res.status(400).send("Invalid Token");
	}
}

async function verifyrole(req, res, next) {
	const token = req.cookies.token || "";
	try {
		if (!token) {
			return res.status(401).json("You need to Login");
		}
		const verified = await jwt.verify(token, process.env.JWT_SECRET);
		req.role = verified._role;
		next();
	} catch (err) {
		res.status(400).send("Invalid Token");
	}
}

module.exports = { verify, verifyrole };
