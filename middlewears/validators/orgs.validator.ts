import Joi from "joi";

export const createOrgsSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().optional(),
});

export const addUserSchema = Joi.object({
	userId: Joi.string().required(),
});
