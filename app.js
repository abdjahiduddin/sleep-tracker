const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv").config();

const authRoutes = require("./routes/auth");
const webRoutes = require("./routes/web");
const sleepRoutes = require("./routes/sleep");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use((req, res, next) => {
  const whiteList = ["http://127.0.0.1:8080", "http://localhost:8080"];
  const origin = "http://" + req.headers.host;

  if (whiteList.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.set("views", "views");

app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.headers.host);
  next();
});

app.use("/auth", authRoutes);
app.use("/sleep", sleepRoutes);
app.use(webRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});
app.use((error, req, res, next) => {
  console.log("Error handled by error handling middleware");
  console.log(error);
  const code = error.statusCode || 500;
  const message = error.message;
  const data = error.data || "";
  res.status(code).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
    console.log("Listen on port 8080");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
