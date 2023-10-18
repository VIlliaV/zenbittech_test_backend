const Joi = require('joi');

const usersRegisterSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'uk'] },
    })
    .message(
      `Please enter a valid email address with the following domains: 'com' 'net' 'ua' 'uk'`
    )
    .options({ presence: 'required' })
    .messages({
      'any.required': `missing required 'email' field`,
      'string.empty': `'email' cannot be an empty field`,
    }),
  password: Joi.string()
    .min(3)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': `'password' cannot be an empty field`,
    }),
});

const usersLoginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'uk'] },
    })
    .message(
      `Please enter a valid email address with the following domains: 'com' 'net' 'ua' 'uk'`
    )
    .options({ presence: 'required' })
    .messages({
      'any.required': `missing required 'email' field`,
      'string.empty': `'email' cannot be an empty field`,
    }),
  password: Joi.string()
    .min(3)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': `'password' cannot be an empty field`,
    }),
});

module.exports = {
  usersRegisterSchema,
  usersLoginSchema,
};
