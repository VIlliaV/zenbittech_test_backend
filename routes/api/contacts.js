const express = require('express');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts-controller');

const validateBody = require('../../decorators/validateBody');
const {
  contactsAddSchema,
  contactsUpdateFavoriteSchema,
} = require('../../schemas/contacts');

const { isBodyEmpty } = require('../../helpers');
const { isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.use(authenticate);

router.get('/', listContacts);

router.get('/:contactId', isValidId, getContactById);

router.post('/', validateBody(contactsAddSchema), addContact);

router.delete('/:contactId', isValidId, removeContact);

router.put(
  '/:contactId',
  isValidId,
  isBodyEmpty,
  validateBody(contactsAddSchema),
  updateContact
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  isBodyEmpty,
  validateBody(contactsUpdateFavoriteSchema),
  updateStatusContact
);

module.exports = router;
