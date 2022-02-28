const express = require('express')
const router = express.Router()
const userController = require('./userController')


router.get('/login', userController.loginGet)
router.post('/login', userController.loginPost)

router.get('/join', userController.joinGet)
router.post('/join', userController.joinPost)

router.get('/welcome', userController.welcome)

router.get('/profile', userController.profile)

router.get('/logout', userController.logout)

router.post('/userDelete', userController.userDelete)

module.exports = router