import Joi from './Joi';
import addressSchema from './AddressSchema';

const blockSchema = Joi.object().keys({
  index: Joi.number().min(0).required(),
  prevBlockHash: Joi.string().length(64).hex().required(),
  dateCreated: Joi.date().iso().required(),
  transactions: Joi.array().required(),
  difficulty: Joi.number().min(0).required(),
  minedBy: addressSchema,
  nonce: Joi.number().min(0).required(),
  blockHash: Joi.string().length(64).hex().required(),
  blockDataHash: Joi.string().length(64).hex().required(),
});

export default blockSchema;
