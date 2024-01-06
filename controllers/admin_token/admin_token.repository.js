const { admin , admin_token , log_trx_api, karyawan } = require("../../models/index")

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getToken = async (token) => {
    const result = await admin_token.findOne({
        where: {
            token,
            expired_at: {
                [Op.gt]: new Date().setHours(0, 0, 0, 0),
            }
        }
    })

    return result
}

module.exports = {
    getToken
}