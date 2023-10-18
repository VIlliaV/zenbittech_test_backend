const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const { nanoid } = require('nanoid');
const { SECRET_KEY } = process.env;

const registerUserCtrl = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) throw HttpError(409);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUsers = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  res.status(201).json({
    user: { email: newUsers.email },
  });
};

const verificationTokenCtrl = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) throw HttpError(404, 'User not found');
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
  });

  res.status(200).json({
    message: 'Verification successful',
  });
};

const loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401);
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
    },
  });
};

const logoutUserCtrl = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json();
};

const currentUserCtrl = async (req, res) => {
  const { name, email } = req.user;

  res.json({ name, email });
};

module.exports = {
  registerUser: ctrlWrapper(registerUserCtrl),
  verificationToken: ctrlWrapper(verificationTokenCtrl),
  loginUser: ctrlWrapper(loginUserCtrl),
  logoutUser: ctrlWrapper(logoutUserCtrl),
  currentUser: ctrlWrapper(currentUserCtrl),
};
