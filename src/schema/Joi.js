const Joi = require('joi');

const customJoi = Joi.extend(joi => ({
  base: joi.string(),
  name: 'string',
  language: {
    address: 'needs to be an ethereum address',
    pubKey: 'needs to be a pubKey',
  },
  rules: [
    {
      name: 'address',
      setup(params) {
        this._flags.address = true; // Set a flag for later use
      },
      validate(params, value, state, options) {
        if (value.length !== 42) {
          // Generate an error, state and options need to be passed
          return this.createError('string.address', { v: value }, state, options);
        }

        if (value.slice(0, 2) !== '0x') {
          return this.createError('string.address', { v: value }, state, options);
        }

        if (Joi.string().length(40).hex().required()
          .validate(value.slice(2)).error) {
          return this.createError('string.address', { v: value }, state, options);
        }

        return value;
      },
    },
    {
      name: 'pubKey',
      setup(params) {
        this._flags.address = true; // Set a flag for later use
      },
      validate(params, value, state, options) {
        if (value.length !== 68) {
          // Generate an error, state and options need to be passed
          return this.createError('string.pubKey', { v: value }, state, options);
        }

        if (value.slice(0, 2) !== '0x') {
          return this.createError('string.pubKey', { v: value }, state, options);
        }

        if (Joi.string().length(66).hex().required()
          .validate(value.slice(2)).error) {
          return this.createError('string.pubKey', { v: value }, state, options);
        }

        return value;
      },
    },
  ],
}));

export default customJoi;
