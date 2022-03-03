const express = require('express')
const router = express.Router()
const replyController = require('./replyController')

// create
router.post('/write', replyController.writePost)

router.post('/like', replyController.likePost)

// read : board/view

// update
// router.get('/edit', replyController.editGet)
// router.post('/edit', replyController.editPost)

// delete
// router.post('/delete', replyController.deleteGet)

module.exports = router