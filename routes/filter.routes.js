const express = require('express')
const { filterFolder, getNotesByPrefix } = require('../controllers/filter.controller')
const router = express.Router()

router.get('/getFolder', filterFolder)
router.post('/getNotesByPrefix', getNotesByPrefix)
module.exports = router