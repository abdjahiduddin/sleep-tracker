const express = require("express");
const { body } = require("express-validator");

const routes = express.Router();

const sleepController = require("../controllers/sleep");

const isAuth = require("../middleware/is-auth");

routes.get("/last", isAuth, sleepController.getLatest);

routes.get("/months/:month", isAuth, sleepController.getMonth);

routes.get("/history", isAuth, sleepController.getHistory);

routes.get("/profile", isAuth, sleepController.getProfile);

routes
  .route("/entry")
  .post(
    [
      body("sleep")
        .trim()
        .isDate()
        .withMessage("Must be valid date")
        .not()
        .isEmpty()
        .withMessage("Sleep time should not empty"),
      body("wakeUp")
        .trim()
        .isDate()
        .withMessage("Must be valid date")
        .not()
        .isEmpty()
        .withMessage("Wake up time should not empty"),
    ],
    isAuth,
    sleepController.insertEntry
  )
  .put(
    [
      body("sleep")
        .trim()
        .isDate()
        .withMessage("Must be valid date")
        .not()
        .isEmpty()
        .withMessage("Sleep time should not empty"),
      body("wakeUp")
        .trim()
        .isDate()
        .withMessage("Must be valid date")
        .not()
        .isEmpty()
        .withMessage("Wake up time should not empty"),
    ],
    isAuth
  );

routes.delete("/entry/:entryId", isAuth, sleepController.deleteEntry);

module.exports = routes;
