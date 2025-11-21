
const Joi = require('joi');

const userUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    'string.email': 'Valid email is required',
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters',
  }),
  role: Joi.string().valid('user', 'admin').optional(),
  phone: Joi.string().optional(),
  location: Joi.string().optional(),
});

module.exports = { userUpdateSchema };
