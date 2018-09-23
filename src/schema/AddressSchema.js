import Joi from './Joi';

const addressSchema = Joi.string().address().required();

export default addressSchema;
