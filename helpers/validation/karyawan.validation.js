const Joi = require('joi');
const {validateRequest} = require('./validation')

const setUpdateKaryawanValidation = Joi.object({
    nama: Joi.string()
        .alphanum()
        .optional(),
    alamat: Joi.string()
        .alphanum()
        .optional(),
    gend: Joi.string()
        .alphanum()
        .optional(),
    tgl_lahir: Joi.date().optional(),
})

const setCreateKaryawanValidation = Joi.object({
    nama: Joi.string()
        .alphanum()
        .required(),
    alamat: Joi.string()
        .alphanum()
        .required(),
    gend: Joi.string()
        .alphanum()
        .required(),
    tgl_lahir: Joi.date().required(),
})

const setParamsNip = Joi.object({
    nip: Joi.string()
        .alphanum()
        .required(),
})

function validateUpdateKaryawan(req,res,next){
    validateRequest(req,res,next,setUpdateKaryawanValidation)
}

function validateCreateKaryawan(req,res,next){
    validateRequest(req,res,next,setCreateKaryawanValidation)
}


module.exports = {
    validateUpdateKaryawan,
    validateCreateKaryawan,
    setParamsNip
}
    