const express = require('express');

const {
  registerUser,
  verificationToken,
  resendVerify,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  updateAvatar,
} = require('../../controllers/users-controller');
const { authenticate, upload } = require('../../middlewares');
const { isBodyEmpty } = require('../../helpers');
const validateBody = require('../../decorators/validateBody');
const {
  usersRegisterSchema,
  usersLoginSchema,
  usersUpdateSubscriptionSchema,
  usersVerifySchema,
} = require('../../schemas/users');
const router = express.Router();

router.post('/signup', validateBody(usersRegisterSchema), registerUser);
router.get('/verify/:verificationToken', verificationToken);
router.post('/verify', validateBody(usersVerifySchema), resendVerify);
router.post('/login', validateBody(usersLoginSchema), loginUser);
router.post('/logout', authenticate, logoutUser);
router.get('/current', authenticate, currentUser);
router.patch(
  '/subscription',
  authenticate,
  isBodyEmpty,
  validateBody(usersUpdateSubscriptionSchema),
  updateSubscription
);

router.patch('/avatar', authenticate, upload.single('avatars'), updateAvatar);

module.exports = router;
