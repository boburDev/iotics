const Joi = require("joi")
const { modulesList } = require("../../global/enum")

const dublicate = () => {
   return {
      login: Joi.string().required(),
      application_name: Joi.string().valid(...modulesList).required(),
      application_version: Joi.string().required(),
      location: Joi.string().required(),
      uuid: Joi.string().required(),
      os: Joi.string().required(),
      key: Joi.string().length(6).required(),
   }
}

module.exports.handshakeValidate = Joi.object().keys({
   public: Joi.string().required(),
   product: Joi.string().required()
}).required()

module.exports.loginValidate = Joi.object().keys({
   ...dublicate(),
   password: Joi.string().required(),
}).required()

module.exports.doubleCheckValidate = Joi.object().keys({
   ...dublicate(),
   password: Joi.string().required(),
   code: Joi.string().required(),
}).required()

module.exports.forgotPasswordValidate = Joi.object().keys({
   ...dublicate(),
   forgot_password: Joi.string().required(),
}).required()

module.exports.refreshValidate =Joi.object().keys({
   application_name: Joi.string().valid(...modulesList).required(),
}).required()

module.exports.informationValidate = Joi.object().keys({
   key: Joi.string().required(),
}).required()
