import Joi from 'joi';

class Model {
  static get schema() {
    return {};
  }

  validate() {
    Joi.validate(
      this,
      this.constructor.schema,
      {
        skipFunctions: true, // skips functions
        abortEarly: false, // get all errors
        allowUnknown: false, // strip unknown props
      },
    );
  }

  get errors() {
    const { error } = this.validate();
    if (error) {
      const { details } = error;
      return details;
    }
    return [];
  }

  isValid() {
    const { error } = this.validate();
    return error === null;
  }
}


export default Model;
