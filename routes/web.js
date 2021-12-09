const express = require("express");

const routes = express.Router();

const webController = require("../controllers/web");

routes.get("/", webController.getIndex);

routes.get("/login", webController.getLogin);

routes.get("/signup", webController.getSignup);

routes.get("/verify", webController.getVerify);

routes.get("/reset", webController.getReset);

routes.get("/new-password", webController.getNewPassword);

routes.get("/dashboard", webController.getDashboard);

module.exports = routes;
