const express = require('express')
const router = express.Router()
const apiController = require('./apiController')

router.post('/board/list', apiController.apiList)


module.exports = router