const {
    responseSuccess, 
    responseError, 
    responseBadRequest,
    responseServerError
} = require("../../helpers/responseHelpers")

const { 
    setNonaktifKaryawan,
    getKaryawanExistByNip,
    setUpdateKaryawan,
    getDataKaryawan,
    generateNIP,
    insertKaryawan
} = require("./karyawan.repository")

const { createLogApi } = require("../log_trx_api/log_trx_api.repository");
const { setParamsNip } = require("../../helpers/validation/karyawan.validation");

const CreateKaryawan = async (req,res) => {
    let responseValue;
    try {
        const {
            nama,
            alamat,
            gend,
            tgl_lahir
        } = req.body
        const generateNip = await generateNIP(new Date().getFullYear())
        const newData = {
            nip: generateNip,
            nama: nama,
            alamat: alamat,
            gend: gend,
            photo: req.file ? req.file.filename : '',
            tgl_lahir: tgl_lahir,
            status: 1,
            insert_at: new Date(),
            id: 0,
        }

        const createNewKaryawan = await insertKaryawan(newData)

        responseValue = responseSuccess(createNewKaryawan,"Success")
        await createLogApi(
            req.id,
            '/',
            JSON.stringify(req.body),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    } catch (error) {
        responseValue = responseServerError("Something went wrong")
        await createLogApi(
            req.id,
            '/',
            JSON.stringify(req.body),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    }
}

const UpdateKaryawan = async (req,res) => {
    let responseValue;
    try {
        const { nip } = req.params;
        const karyawanData = await getKaryawanExistByNip(nip)
        if(!karyawanData){
            responseValue = responseError("Data not found")
            await createLogApi(
                req.id,
                "karyawan/update",
                JSON.stringify(req.body),
                JSON.stringify(responseValue.body),
                new Date()
            )
    
            return res.status(responseValue.status).json(responseValue.body)
        }
    
        let updatedData = req.body
        updatedData.update_at = new Date()
        if(req.file){
            updatedData.photo = req.file.filename
        }
    
        const karyawanUpdate = await setUpdateKaryawan(req.body,nip)
        if(!karyawanUpdate){
            responseValue = responseServerError("Something went wrong")
            await createLogApi(
                req.id,
                "/",
                JSON.stringify(req.body),
                JSON.stringify(responseValue.body),
                new Date()
            )
    
            return res.status(responseValue.status).json(responseValue.body)
        }
    
        responseValue = responseSuccess(req.body,"Success Update Karyawan")
        return res.status(responseValue.status).json(responseValue.body)
    } catch (error) {
        responseValue = responseServerError("Something went wrong")
        await createLogApi(
            req.id,
            '/',
            JSON.stringify(req.params),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    }
}

const NonaktifKaryawan = async (req,res) => {
    let responseValue;
    try {
        const { error, value } = setParamsNip.validate(req.params)
        if(error){
            responseValue = responseError(error.details[0].message)
            await createLogApi(
                req.id,
                'karyawan/nonaktif',
                JSON.stringify(req.params),
                JSON.stringify(responseValue),
                new Date()
            )
            return res.status(responseValue.status).json(responseValue.body)
        }
        const { nip } = req.params
    
        const isKaryawanExists = await getKaryawanExistByNip(nip) 
        if(!isKaryawanExists){
            responseValue = responseError("Data not found")
            await createLogApi(
                req.id,
                'karyawan/nonaktif',
                JSON.stringify(req.params),
                JSON.stringify(responseValue),
                new Date()
            )
            return res.status(responseValue.status).json(responseValue.body)
        }
    
        const deactiveKaryawan = await setNonaktifKaryawan(nip,req.username)
        if(!deactiveKaryawan){
            responseValue = responseServerError("Something went wrong")
            await createLogApi(
                req.id,
                'karyawan/nonaktif',
                JSON.stringify(req.params),
                JSON.stringify(responseValue),
                new Date()
            )
    
            return res.status(responseValue.status).json(responseValue.body)
        }
    
        responseValue = responseSuccess(null,"Success Nonaktif karyawan")
        await createLogApi(
            req.id,
            'karyawan/nonaktif',
            JSON.stringify(req.params),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
        
    } catch (error) {
        responseValue = responseServerError("Something went wrong")
        await createLogApi(
            req.id,
            'karyawan/nonaktif',
            JSON.stringify(req.params),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    }
}

const ListDataKaryawan = async (req,res) => {
    let responseValue;
    try {
        const nama = req.query.nama !== undefined ? req.query.nama : null;
        const start = req.query.start !== undefined ? Number(req.query.start) : 1;
        const count = req.query.count !== undefined ? Number(req.query.count) : 10;
        
        const result = await getDataKaryawan(nama,start,count)
        if(result.length === 0){
            responseValue = responseError("Data not found")
            return res.status(responseValue.status).json(responseValue.body)
        }
        responseValue = responseSuccess(null,result)
        await createLogApi(
            req.id,
            '/',
            JSON.stringify(req.params),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    } catch (error) {
        responseValue = responseServerError("Something went wrong")
        await createLogApi(
            req.id,
            '/',
            JSON.stringify(req.params),
            JSON.stringify(responseValue),
            new Date()
        )
        return res.status(responseValue.status).json(responseValue.body)
    }
}


module.exports = {
    NonaktifKaryawan,
    UpdateKaryawan,
    ListDataKaryawan,
    CreateKaryawan,
}