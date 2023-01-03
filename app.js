const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// routes
const registerRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
// dotenv
dotenv.config();

//db connect
mongoose.connect(
	process.env.MONGOOSE_CONNECTION_STRING_ATLAS,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => console.log("Connected to db")
);

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//route middlewares
app.use("/user", registerRoute);
app.use("/details", postRoute);
app.listen(port, () => console.log(`Server is Up and Running`));
