const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");

//Load our environement variables
dotenv.config();

//Importing routes
const userRoute = require("./routes/user");

//Connectiong to mongo db
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true},
  () => {
    console.log("Connected to database successfully.");
  }
);
//Using cors middleware to avoid cors policy issues.
app.use(cors());
//Using express json middle to parse http request body.
app.use(express.json());
//Using express urlenconded to parse form body data.
app.use(express.urlencoded({ extended: true }));
//Using morgan logger
app.use(morgan("dev"));

const router = express.Router();
router.use("/user", userRoute);

app.use("/api/v1", router);
module.exports = app;
