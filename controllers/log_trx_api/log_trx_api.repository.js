const { admin , admin_token , log_trx_api, karyawan } = require("../../models/index")

const createLogApi = async (
    user_id,
    api,
    request,
    response,
    insert_at
) => {
    const result = await log_trx_api.create({
        user_id,
        api,
        request,
        response,
        insert_at
    })

    return result
}

module.exports = {
    createLogApi
}