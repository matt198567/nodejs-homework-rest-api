const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/userModel");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const checkToken = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer" || token === "") {
      next(new Unauthorized("Not authorized"));
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user) {
      next(new Unauthorized("Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized("Not authorized"));
  }
};

module.exports = {
  checkToken,
};
