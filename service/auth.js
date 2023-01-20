const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const gravatar = require("gravatar");
const { Conflict, Unauthorized } = require("http-errors");
const { User } = require("../models/userModel");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const register = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    // const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      //   avatarURL,
    });
    return newUser;
  }
  throw new Conflict("Email in use");
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user);
  const isPasswordCompare = await bcrypt.compare(password, user.password);
  if (!user || !isPasswordCompare) {
    throw new Unauthorized("Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  await User.findByIdAndUpdate(user._id, { token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

const logout = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }
  await User.findByIdAndUpdate(id, { token: null });
};

module.exports = {
  register,
  login,
  logout,
};
