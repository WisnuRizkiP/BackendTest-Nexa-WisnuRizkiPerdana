const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { admin , admin_token , log_trx_api, } = require("../../models/index")
const { generateToken } = require("../../helpers/jwt")
const {
    responseSuccess, 
    responseError, 
    responseBadRequest,
    responseServerError
} = require("../../helpers/responseHelpers")

const { 
    setNonaktifKaryawan,
    getKaryawanExistByNip
} = require("../karyawan/karyawan.repository")

const { createLogApi } = require("../log_trx_api/log_trx_api.repository")

const Login = async (req, res) => {
    try {
        const {username,password} = req.body;
        let responseValue;

        const adminData  = await admin.findOne({
            where: {
                username
            }
        })
        if(!adminData){
            responseValue = responseError("User not found")            
            await createLogApi(
                '',
                'auth/login',
                JSON.stringify(req.body),
                JSON.stringify(responseValue),
                new Date()
            )
            
            return res.status(responseValue.status).json(responseValue.body)
        }

        const buffer = adminData.password;
        const passwordString = buffer.toString('utf8');
        const isPasswordValid = bcrypt.compareSync(password, passwordString);
        if(!isPasswordValid){
            responseValue = responseError("Password Not Match")
            await createLogApi(
                adminData.id,
                'auth/login',
                JSON.stringify(req.body),
                JSON.stringify(responseValue),
                new Date()
            )

            return res.status(responseValue.status).json(responseValue.body)
        }
        
        
        // Check the validity of the existing token
        // If a valid token is available, send that token
        // If no valid token is found, generate a new token
        const adminTokenData = await admin_token.findOne({
            where: {
                id_admin: adminData.id,
                expired_at: {
                    [Op.gt]: new Date().setHours(0, 0, 0, 0),
                }
            }
        })
        if(adminTokenData){
            responseValue = responseSuccess({
                id: adminTokenData.id_admin,
                token: adminTokenData.token
            },"Login Success")
           
            await createLogApi(
                adminData.id,
                'auth/login',
                JSON.stringify(req.body),
                JSON.stringify(responseValue),
                new Date()
            )
    
            return res.status(responseValue.status).json(responseValue.body)
        }

        const dataJwt = {
            id: adminData.id,
            username,
            password
        }

        const jwtToken = generateToken(dataJwt);

        responseValue = responseSuccess({
            id: adminData.id,
            token: jwtToken
        },"Login Success")

        const today = new Date();
        today.setDate(today.getDate() + 30);
        await admin_token.create({
            id_admin: adminData.id,
            token: jwtToken,
            expired_at: today
        })
       
        await createLogApi(
            adminData.id,
            'auth/login',
            JSON.stringify(req.body),
            JSON.stringify(responseValue),
            new Date()
        )

        return res.status(responseValue.status).json(responseValue.body)
      
      } catch (error) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal menambahkan User',
            error
        })
      }
};

module.exports = {
    Login
}