import Joi from 'joi';

const transactionSchema = Joi.object().keys({
  from: Joi.string().length(40).hex().required(),
  to: Joi.string().length(40).hex().required(),
  value: Joi.number().min(0).required(),
  fee: Joi.number().min(0.005).required(),
  dateCreated: Joi.date().iso().required(),
  data: Joi.string(),
  senderPubKey: Joi.string().length(65).hex().required(),
  transactionDataHash: Joi.string().length(64).hex().required(),
  senderSignature: Joi.any(), // to be updated
  minedInBlockIndex: Joi.number().min(0).optional(),
  transferSuccessful: Joi.boolean().required(),
});

export default transactionSchema;
