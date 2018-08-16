import Joi from 'joi';

const blockSchema = Joi.object().keys({
  index: Joi.number().min(0).required(),
  prevBlockHash: Joi.hex().required(),
  dateCreated: Joi.date().iso().required(),
  transactions: Joi.array().required(),
  difficulty: Joi.number().min(1).required(),
  minedBy: Joi.string().hex(40).length().required(),
  nonce: Joi.number().min(0).required(),
  blockHash: Joi.string().length(64).hex().required(),
  blockDataHash: Joi.string().length(64).hex().required(),
});

export default blockSchema;
