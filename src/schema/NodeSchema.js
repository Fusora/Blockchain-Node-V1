import Joi from 'joi';

const nodeSchema = Joi.object().keys({
  nodeId: Joi.string().required(),
  selfUrl: Joi.string().required(),
  peers: Joi.object(),
  blockchain: Joi.object(),
});

export default nodeSchema;
