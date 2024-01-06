const { getToken } = require("../controllers/admin_token/admin_token.repository")
const {
    responseSuccess, 
    responseError, 
    responseBadRequest,
    responseServerError
} = require("../helpers/responseHelpers")
require('dotenv').config();

const jwt = require('jsonwebtoken');
const privateKey = process.env.SECRET_KEY

const verify = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    let responseValue;
    const isTokenExists = await getToken(token)
    if(!isTokenExists){
        responseValue = responseError("Token not found")
        return res.status(responseValue.status).json(responseValue.body)
    }
    
    jwt.verify(token, privateKey, (err, decoded) => {
        if(err) {
            responseValue = responseError("Token Not valid")
            return res.status(responseValue.status).json(responseValue.body)
        }

        req.id = decoded.id
        req.username = decoded.username
        next()
    })
}

const generateToken = (payload) => {
    const token = jwt.sign(payload, privateKey, { 
        algorithm: 'HS256',
     });
     return token
}

module.exports = {
    verify,
    generateToken
}