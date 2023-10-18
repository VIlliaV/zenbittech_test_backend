const express = require('express');

const {
  registerUser,
  verificationToken,
  loginUser,
  logoutUser,
  currentUser,
} = require('../../controllers/users-controller');
const { authenticate } = require('../../middlewares');
const validateBody = require('../../decorators/validateBody');
const {
  usersRegisterSchema,
  usersLoginSchema,
} = require('../../schemas/users');

const router = express.Router();

router.post('/signup', validateBody(usersRegisterSchema), registerUser);
router.get('/verify/:verificationToken', verificationToken);
router.post('/login', validateBody(usersLoginSchema), loginUser);
router.post('/logout', authenticate, logoutUser);
router.get('/current', authenticate, currentUser);

module.exports = router;
