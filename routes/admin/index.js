const express = require('express')
const router = express.Router()
const adminController = require('./adminController')


router.get('/user', adminController.adminUserGet)
router.post('/user', adminController.adminUserPost)

router.get('/board', adminController.adminBoardGet)
router.post('/board', adminController.adminBoardPost)


module.exports = router