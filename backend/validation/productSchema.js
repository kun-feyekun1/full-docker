
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  unit: Joi.string().allow(''),    
  location: Joi.string().allow(''), 
});

module.exports = { productSchema };
