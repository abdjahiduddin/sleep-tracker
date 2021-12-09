const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv").config();

const User = require("../models/user");

const Transporter = require("../utils/nodemailer");

exports.signup = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = validation.array();
    return next(error);
  }

  const name = req.body.username;
  const email = req.body.email;
  const age = req.body.age || 0;
  const password = req.body.password;

  try {
    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      age: age,
      password: hashPassword,
    });

    const result = await user.save();

    const verifyToken = generateJwtToken(
      email,
      result._id,
      "verification",
      "1h"
    );

    const mailOptions = {
      from: `Sleep Tracker <${process.env.EMAIL_USER}> noreply-email`,
      to: `${email}`,
      subject: "Verify your email address",
      html: `
        <h1>Hello ${email} !</h1>
        <h2>Please click the link below to verify your email address</h2>
        <h3><a href="${process.env.HOST}/verify?verify=${verifyToken}">Verify Email Address</a></h3>
        <p>If you don't create an account, no further action is required</p>

      `,
    };
    const emailInfo = await Transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "User created",
      date: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    const err = new Error("Email verification failed");
    err.statusCode = 401;
    err.data = "Token not valid or expired";
    return next(err);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    const err = new Error("Email verification failed");
    err.statusCode = 401;
    err.data = "Token not valid or expired";
    return next(err);
  }

  try {
    const user = await User.findById(decodedToken.id);
    user.status = true;
    await user.save();

    res.status(200).json({
      message: "Email verification success",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      next(error);
    }
  }
};

exports.login = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = validation.array();
    return next(err);
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const err = new Error("Invalid user or password");
      err.statusCode = 401;
      err.data = "Invalid user or password";
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Invalid user or password");
      err.statusCode = 401;
      err.data = "Invalid user or password";
      throw err;
    }

    if (!user.status) {
      const err = new Error("Unverified user");
      err.statusCode = 401;
      err.data = "Unverified user";
      throw err;
    }

    const jwtToken = generateJwtToken(user.email, user._id, "session", "15m");
    const refreshToken = generateRefreshToken();

    const date = new Date();
    const expired = new Date(date.setDate(date.getDate() + 7));

    user.refreshToken = refreshToken;
    user.refreshTokenExpired = expired;
    await user.save();

    setRefreshTokenCookie(res, refreshToken, expired);

    res.status(200).json({
      token: jwtToken,
      userId: user._id.toString(),
      expiresIn: 780000 //13m to miliseconds
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
      return res.status(204).json({
        message: "Credential not found",
      });
    }
    
    setRefreshTokenCookie(res, "", new Date(Date.now()))
    res.clearCookie("refreshToken");
    
    const user = await User.findOne({ refreshToken:  refreshTokenCookie})

    user.refreshToken = ""
    user.refreshTokenExpired = Date.now()
    await user.save()

    res.status(200).json({
      message: "Credential deleted"
    })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.refreshCredentials = async (req, res, next) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  if (!refreshTokenCookie) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }

  try {
    const user = await User.findOne({
      refreshToken: refreshTokenCookie,
      refreshTokenExpired: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    const jwtToken = generateJwtToken(user.email, user._id, "session", "15m");
    const newRefreshToken = generateRefreshToken();

    const date = new Date();
    const expired = new Date(date.setDate(date.getDate() + 7));

    user.refreshToken = newRefreshToken;
    user.refreshTokenExpired = expired;
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken, expired);

    res.status(200).json({
      token: jwtToken,
      userId: user._id.toString(),
      expiresIn: 780000 //13m to miliseconds
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const generateJwtToken = (email, id, state, expired) => {
  const jwtToken = jwt.sign(
    {
      email: email,
      id: id.toString(),
      state: state,
    },
    process.env.JWT_SECRET,
    { expiresIn: expired }
  );

  return jwtToken;
};

const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const setRefreshTokenCookie = (res, token, expires) => {
  const cookieOptions = {
    httpOnly: true,
    expires: expires,
  };

  res.cookie("refreshToken", token, cookieOptions);
};
