const express = require('express')
const router = express.Router()
const boardController = require('./boardController')

router.get('/list', boardController.listGet)

router.get('/view', boardController.viewGet)
router.post('/view', boardController.viewPost)

router.get('/write', boardController.writeGet)
router.post('/write', boardController.writePost)

router.get('/update', boardController.updateGet)
router.post('/update', boardController.updatePost)

router.get('/delete', boardController.deleteGet)

module.exports = router
