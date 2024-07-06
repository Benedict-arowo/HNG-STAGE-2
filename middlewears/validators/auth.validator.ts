import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Email must be a valid email address",
	}),
	password: Joi.string().min(3).required().messages({
		"string.empty": "Password is required",
		"string.min": "Password must be at least 3 characters long",
	}),
});

export const registerSchema = Joi.object({
	firstName: Joi.string().required().messages({
		"string.empty": "First name is required",
	}),
	lastName: Joi.string().required().messages({
		"string.empty": "Last name is required",
	}),
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Email must be a valid email address",
	}),
	password: Joi.string().min(3).required().messages({
		"string.empty": "Password is required",
		"string.min": "Password must be at least 3 characters long",
	}),
	phone: Joi.string().optional().messages({
		"string.base": "Phone number must be a string",
	}),
});
