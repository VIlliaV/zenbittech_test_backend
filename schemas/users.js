const Joi = require('joi');

const usersRegisterSchema = Joi.object({
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

module.exports = {
  usersRegisterSchema,
  usersLoginSchema,
};
