const Joi = require('joi');
const {validateRequest} = require('./validation')

const loginValidation = Joi.object({
    password: Joi.string()
        .min(7)
        .required(),

    username: Joi.string()
        .alphanum()
        .required()
})



function validateLogin(req,res,next){
    validateRequest(req,res,next,loginValidation)
}


module.exports = {
    validateLogin
}
    