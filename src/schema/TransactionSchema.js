import Joi from './Joi';
import addressSchema from './AddressSchema';

const transactionSchema = Joi.object().keys({
  from: addressSchema,
  to: addressSchema,
  value: Joi.number().min(0).required(),
  fee: Joi.number().min(5000).required(),
  dateCreated: Joi.date().iso().required(),
  data: Joi.string().optional().allow(null).allow(''),
  senderPubKey: Joi.string().pubKey().required(),
  senderSignature: Joi.any(),
});

export default transactionSchema;
