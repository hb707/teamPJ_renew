const express = require('express')
const router = express.Router()
const boardRouter = require('./board')
const userRouter = require('./user')
const adminRouter = require('./admin')
const { alertmove } = require('../util/alert')


// 로그인 확인 미들웨어
const Access = (req, res, next) => {
    let { currentUser } = req.session
    if (currentUser == undefined) {
        res.send(alertmove('/', '회원만 가능한 기능입니다'))
    }
    else if (currentUser.active === 0) {
        res.send(alertmove('/', '이용이 정지된 계정입니다'))
        req.session.destroy(() => {
            req.session;
        });
        res.redirect('/')
    }
    else {
        next()
    }
}

// 관리자 확인 미들웨어
const AdminAccess = (req, res, next) => {
    let { currentUser } = req.session
    if (currentUser.level > 1) {
        next()
    }
    else {
        res.send(alertmove('/', '관리자 전용 기능입니다'))
    }
}

router.get('/', (req, res) => {
    let nickname = 'GUEST'
    if (req.session.currentUser !== undefined) {
        nickname = req.session.currentUser.nickname
    }
    res.render('index', {
        nickname
    })
})

router.use('/user', userRouter)
router.use('/board', Access, boardRouter)
router.use('/admin', Access, AdminAccess, adminRouter)

module.exports = router
