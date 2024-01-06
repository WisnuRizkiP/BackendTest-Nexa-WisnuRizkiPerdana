const express = require('express')
const router = express.Router()
const admin = require('./admin.route')
const karyawan = require('./karyawan.route')

router.use('/admin', admin);
router.use('/karyawan', karyawan);

module.exports = router