const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(6).required(),
});

const loginValidation = Joi.object({
  email : Joi.string().email().required(),
  password : Joi.string().required(),
})

module.exports = {registerValidation, loginValidation};