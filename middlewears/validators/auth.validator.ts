import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(3).required(),
});

export const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(3).required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	phone: Joi.string().optional(),
});
