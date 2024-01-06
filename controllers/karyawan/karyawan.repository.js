const { admin , admin_token , log_trx_api, karyawan } = require("../../models/index")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getKaryawanExistByNip = async (nip) => {
    const result = await karyawan.findOne({
        where: {
            nip
        }
    })

    return result
}

const setNonaktifKaryawan = async (nip,username) => {
    const result = await karyawan.update({
         status: 9,
         update_at: new Date(),
    }, {
        where: {
          nip
        },
    });
    return result
}

const setUpdateKaryawan = async (dataUpdate,nip) => {
    const result = await karyawan.update(dataUpdate,{
        where: {
            nip
        }
    })

    return result
}

const getDataKaryawan = async (nama,start,count) => {
    const offset = (start - 1) * count;
    const result = await karyawan.findAll({
        where: {
            nama: nama ? { [Op.like]: `%${nama}%` } : { [Op.ne]: null },
        },
        limit: count,
        offset,
    })

    return result
}


const generateNIP = async (year) => {
    const highestNip = await karyawan.max('nip', {
    where: {
        nip: {
            [Op.startsWith]: `${year}`, // Using Op.startsWith for the given year
        },
    },
    });

    const nextNip = highestNip ? parseInt(highestNip) + 1 : `${year}00001`;

    return String(nextNip)
}

const insertKaryawan = async (data) => {
    const result = await karyawan.create(data)
    return result

}
module.exports = {
    setNonaktifKaryawan,
    getKaryawanExistByNip,
    setUpdateKaryawan,
    getDataKaryawan,
    generateNIP,
    insertKaryawan
}