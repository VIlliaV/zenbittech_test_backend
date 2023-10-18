const Joi = require('joi');
const { subscriptionList } = require('../constants');

const usersRegisterSchema = Joi.object({
  name: Joi.string().max(25).required().messages({
    'any.required': `missing required 'name' field`,
    'string.empty': `'name' cannot be an empty field`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'uk'] },
    })
    .required()
    .messages({
      'any.required': `missing required 'email' field`,
      'string.empty': `'email' cannot be an empty field`,
    }),
  password: Joi.string().min(4).required().messages({
    'any.required': `missing required 'password' field`,
    'string.empty': `'password' cannot be an empty field`,
  }),
});

const usersVerifySchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'uk'] },
    })
    .required()
    .messages({
      'any.required': `missing required field 'email'`,
      'string.empty': `'email' cannot be an empty field`,
    }),
});

const usersLoginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'uk'] },
    })
    .required()
    .messages({
      'any.required': `missing required 'email' field`,
      'string.empty': `'email' cannot be an empty field`,
    }),
  password: Joi.string().min(4).required().messages({
    'any.required': `missing required 'password' field`,
    'string.empty': `'password' cannot be an empty field`,
  }),
});

const usersUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

module.exports = {
  usersRegisterSchema,
  usersLoginSchema,
  usersUpdateSubscriptionSchema,
  usersVerifySchema,
};
