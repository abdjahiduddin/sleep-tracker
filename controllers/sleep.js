const { validationResult } = require("express-validator");

const Sleep = require("../models/sleep-trend");
const User = require("../models/user");

// Utils
const DataMapping = require("../utils/data-mapping");
const TimeCalc = require("../utils/time-calculation");

exports.getProfile = async (req, res, next) => {
  if (!req.userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "Please login. \n Redirect to login page in 5 sec..";
    return next(err);
  }

  try {
    const user = await User.findById(req.userId, "name -_id");
    res.status(200).json({
      message: "Profile found!!",
      username: user.name,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getLatest = async (req, res, next) => {
  if (!req.userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "Please login. \n Redirect to login page in 5 sec..";
    return next(err);
  }

  try {
    const result = await Sleep.find({ user_id: req.userId })
      .limit(7)
      .sort({ start: -1 });

    prepareDataForRespon(req, res, result);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getMonth = async (req, res, next) => {
  if (!req.userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "Please login. \n Redirect to login page in 5 sec..";
    return next(err);
  }

  try {
    const month = req.params.month;

    const result = await Sleep.find({
      user_id: req.userId,
      $expr: { $eq: [{ $month: "$start" }, +month] },
    }).sort({ start: -1 });

    prepareDataForRespon(req, res, result);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  if (!req.userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "Please login. \n Redirect to login page in 5 sec..";
    return next(err);
  }

  try {
    const result = await Sleep.find({ user_id: req.userId }).sort({
      start: -1,
    });

    prepareDataForRespon(req, res, result);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.insertEntry = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "User id not found";
    return next(err);
  }

  const validation = validationResult(req);

  if (!validation.isEmpty) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = validation.array();
    return next(err);
  }

  try {
    const sleep = req.body.sleep;
    const wakeUp = req.body.wakeUp;
    const tz = req.body.tz;

    const sleepTime = new Date(sleep);
    const wakeUpTime = new Date(wakeUp);

    const diff = wakeUpTime - sleepTime;
    const duration = TimeCalc.milisecondsToTime(diff);

    const newSleep = new Sleep({
      user_id: userId,
      start: sleepTime,
      end: wakeUpTime,
      duration: duration,
      timezone: tz,
    });

    const result = await newSleep.save();

    res.status(200).json({
      savedId: result._id.toString(),
      message: "Entry saved",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateEntry = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "User id not found";
    return next(err);
  }

  const validation = validationResult(req);

  if (!validation.isEmpty) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = validation.array();
    return next(err);
  }

  
  try {
    const entryId = req.body.entryId;
    const sleep = req.body.sleep;
    const wakeUp = req.body.wakeUp;
    const tz = req.body.tz;

    const sleepEntry = await Sleep.findById(entryId);

    if (req.userId.toString() !== sleepEntry.user_id.toString()) {
      const err = new Error("Not authorized");
      err.statusCode = 403;
      err.data = "You do not have access rights to the content";
      return next(err);
    }

    const sleepTime = new Date(sleep);
    const wakeUpTime = new Date(wakeUp);

    const diff = wakeUpTime - sleepTime;
    const duration = TimeCalc.milisecondsToTime(diff);

    const newSleep = new Sleep({
      user_id: userId,
      start: sleepTime,
      end: wakeUpTime,
      duration: duration,
      timezone: tz,
    });

    const result = await newSleep.save();

    await Sleep.findByIdAndDelete(entryId);

    res.status(200).json({
      savedId: result._id.toString(),
      message: "Entry edited",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteEntry = async (req, res, next) => {
  if (!req.userId) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    err.data = "Please login. \n Redirect to login page in 5 sec..";
    return next(err);
  }

  const entryId = req.params.entryId;

  try {
    const sleep = await Sleep.findById(entryId);

    if (req.userId.toString() !== sleep.user_id.toString()) {
      const err = new Error("Not authorized");
      err.statusCode = 403;
      err.data = "You do not have access rights to the content";
      return next(err);
    }

    await Sleep.findByIdAndDelete(entryId);
    res.status(200).json({
      message: "Entry deleted",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const prepareDataForRespon = (req, res, result) => {
  const mapResult = DataMapping.mapListTime(result);

  const data = mapResult.dataChart;
  const lists = mapResult.dataTable;
  const sleepLessSix = mapResult.sleepLessSix;
  const sleepMoreEight = mapResult.sleepMoreEight;

  const wakeUpList = mapResult.wakeUpList;
  const sleepList = mapResult.sleepList;
  const durationList = mapResult.durationList;

  const avgWakeUp = TimeCalc.findAverageTime(wakeUpList);
  const avgSleep = TimeCalc.findAverageTime(sleepList);
  const avgDuration = TimeCalc.findAverageTime(durationList);

  res.status(200).json({
    message: "Successful retrieve all data",
    userId: req.userId,
    data: data,
    lists: lists,
    sleepLessSix: sleepLessSix,
    sleepMoreEight: sleepMoreEight,
    avgWakeUp: avgWakeUp,
    avgSleep: avgSleep,
    avgDuration: avgDuration,
    total: result.length,
  });
};
