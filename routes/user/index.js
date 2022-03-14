const express = require('express')
const router = express.Router()
const userController = require('./userController')
const { passportFacebook, passportFacebookCallback } = require('../../middelware/passport-fb')


router.get('/login', userController.loginGet)
router.post('/login', userController.loginPost) // 기존의 jwt 방식 로그인
router.get('/login2', (req, res, next) => { console.log('1번실행'); next() }, passportFacebook) // passport-facebook 사용한 로그인
router.get('/login2/callback', (req, res, next) => { console.log('2번실행'); next() }, passportFacebookCallback, (req, res, next) => { console.log('3번실행'); next() }, userController.loginFacebookGet)


router.get('/join', userController.joinGet)
router.post('/join', userController.joinPost)

router.get('/welcome', userController.welcome)

router.get('/profile', userController.profile)

router.get('/logout', userController.logout)

router.post('/userDelete', userController.userDelete)

// ajax처리 라우터
router.post('/idCheck', userController.idCheck)

module.exports = router