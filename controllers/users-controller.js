const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const User = require("../models/user");
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");
const { nanoid } = require("nanoid");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.resolve("public", "avatars");

const registerUserCtrl = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) throw HttpError(409);
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  const status = await sendEmail(verifyEmail);

  if (status !== "Ok") {
    const { response, responseCode } = status;
    throw HttpError(responseCode, response);
  }
  const newUsers = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    user: { name, email: newUsers.email, subscription: newUsers.subscription },
  });
};

const verificationTokenCtrl = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) throw HttpError(404, "User not found");
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyCtrl = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401);
  const { verificationToken, verify } = user;
  if (verify) throw HttpError(400, "Verification has already been passed");
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  const status = await sendEmail(verifyEmail);

  if (status !== "Ok") {
    const { response, responseCode } = status;
    throw HttpError(responseCode, response);
  }

  res.status(200).json({ message: "Verification email sent" });
};

const loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw HttpError(401);
  if (!user.verify) throw HttpError(401, "Please verify your email");
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401);
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
      name: user.name,
      avatarURL: user.avatarURL,
    },
  });
};

const logoutUserCtrl = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const currentUserCtrl = async (req, res) => {
  const { name, email, subscription, avatarURL } = req.user;

  res.json({ name, email, subscription, avatarURL });
};

const updateSubscriptionCtrl = async (req, res) => {
  const { _id, email } = req.user;

  const { subscription } = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  res.json({ email, subscription });
};

const updateAvatarCtrl = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarDir, filename);

  await Jimp.read(oldPath)
    .then((avatar) => {
      return avatar.resize(250, 250).write(oldPath);
    })
    .catch((err) => {
      console.error(err);
    });

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  const { avatarURL: oldAvatar } = await User.findById(_id);

  const oldAvatarDir = path.join("public", oldAvatar);

  if (avatarURL !== oldAvatar) {
    try {
      await fs.unlink(oldAvatarDir);
    } catch (error) {
      console.log(error);
    }
  }

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  registerUser: ctrlWrapper(registerUserCtrl),
  verificationToken: ctrlWrapper(verificationTokenCtrl),
  resendVerify: ctrlWrapper(resendVerifyCtrl),
  loginUser: ctrlWrapper(loginUserCtrl),
  logoutUser: ctrlWrapper(logoutUserCtrl),
  currentUser: ctrlWrapper(currentUserCtrl),
  updateSubscription: ctrlWrapper(updateSubscriptionCtrl),
  updateAvatar: ctrlWrapper(updateAvatarCtrl),
};
