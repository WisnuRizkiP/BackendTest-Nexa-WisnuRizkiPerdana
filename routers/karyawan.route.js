const express = require('express')
const router = express.Router()
const multer = require('multer');
const { verify } = require('../helpers/jwt')
const {
    validateUpdateKaryawan,
    validateCreateKaryawan
} = require('../helpers/validation/karyawan.validation')
const {
    NonaktifKaryawan,
    UpdateKaryawan,
    ListDataKaryawan,
    CreateKaryawan,
} = require('../controllers/karyawan/karyawan.controller')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/'); // Specify the folder where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, btoa(file.originalname)); // Use unique filenames
    },
});

const upload = multer({ storage });

router.put('/nonaktif/:nip',verify,NonaktifKaryawan);
router.get('/',verify,ListDataKaryawan);
router.post('/',verify,upload.single('image'),validateCreateKaryawan,CreateKaryawan);
router.put('/:nip',verify,upload.single('image'),validateUpdateKaryawan,UpdateKaryawan);

module.exports = router ;