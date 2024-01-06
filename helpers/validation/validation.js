const { createLogApi } = require("../../controllers/log_trx_api/log_trx_api.repository")
const {
    responseSuccess, 
    responseError, 
    responseBadRequest,
    responseServerError
} = require("../responseHelpers")
async function validateRequest(req,res,next,schema){
    const {error,value} = schema.validate(req.body);
    let responseValue;
    if(error){
        responseValue = responseBadRequest(error.details[0].message)
        await createLogApi(
            req.id !== undefined ? req.id : '',
            req.url,
            '',
            JSON.stringify(responseValue.body),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    }else{
        req.body = value;
        next();
    }
}

async function validateParamsRequest(req,res,next,schema){
    console.log(req.params)
    // const {error,value} = schema.validate(req.params);
    // let responseValue;
    // if(error){
    //     responseValue = responseBadRequest(error.details[0].message)
    //     await createLogApi(
    //         req.id !== undefined ? req.id : '',
    //         req.url,
    //         '',
    //         JSON.stringify(responseValue.body),
    //         new Date()
    //     )
    //     return res.status(responseValue.status).json(responseValue.body)
    // }else{
    //     req.body = value;
    //     next();
    // }
    next()
}


module.exports = {
    validateRequest,
    validateParamsRequest
}