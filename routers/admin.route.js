const express = require('express')
const router = express.Router()
const {
    validateLogin
} = require('../helpers/validation/admin.validation')
const {
    Login
} = require('../controllers/admin/admin.controller')

router.post('/login',validateLogin ,Login);

module.exports = router ;