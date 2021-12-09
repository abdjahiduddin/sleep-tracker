const path = require("path");

exports.getIndex = (req, res, next) => {
  res.redirect("/dashboard");
};

exports.getLogin = (req, res, next) => {
  const path = generateViewPath("auth", "login.html");
  res.sendFile(path);
};

exports.getSignup = (req, res, next) => {
  const path = generateViewPath("auth", "signup.html");
  res.sendFile(path);
};

exports.getVerify = (req, res, next) => {
  const path = generateViewPath("auth", "verify.html");
  res.sendFile(path);
};

exports.getReset = (req, res, next) => {
  const path = generateViewPath("auth", "reset-password.html");
  res.sendFile(path);
};

exports.getNewPassword = (req, res, next) => {
  const path = generateViewPath("auth", "new-password.html");
  res.sendFile(path);
};

exports.getDashboard = (req, res, next) => {
  const path = generateViewPath("trends", "dashboard.html");
  res.sendFile(path);
};

const generateViewPath = (dir, file) => {
  if (dir) {
    return path.join(__dirname, "..", "views", dir, file);
  }
  return path.join(__dirname, "..", "views", file);
};
