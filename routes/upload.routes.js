const multer = require('multer')
const express = require('express')
const {uploadFile, uploadFolder, deleteFolder, deleteFile} = require('../controllers/upload.controller.js')

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/uploadFile', upload.single('file'), uploadFile)
router.post('/uploadFolder', upload.array('files'), uploadFolder)
router.delete('/deleteFolder', deleteFolder)
router.delete('/deleteFile', deleteFile)

module.exports = router 