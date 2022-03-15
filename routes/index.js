const express = require('express')
const router = express.Router()
const boardRouter = require('./board')
const userRouter = require('./user')
const adminRouter = require('./admin')
const replyRouter = require('./reply')
const apiRouter = require('./api')
const { alertmove } = require('../util/alert')
const { auth, authAdmin } = require('../middelware/auth')
const { decoding } = require('../util/jwt')


router.get('/', (req, res) => {
    const { AccessToken } = req.cookies
    let nickname = 'GUEST'
    if (AccessToken !== undefined) {
        nickname = decoding(AccessToken).nickname
    }
    res.render('index', { nickname })
})

router.use('/user', userRouter)
router.use('/board', auth, boardRouter)
router.use('/admin', auth, authAdmin, adminRouter)
router.use('/reply', replyRouter)
router.use('/api', apiRouter)

module.exports = router


// 세션 방식 로그인 (jwt 변경 전)

// 로그인 확인 미들웨어
// const Access = (req, res, next) => {
//     let { currentUser } = req.session
//     if (currentUser == undefined) {
//         res.send(alertmove('/', '회원만 가능한 기능입니다'))
//     }
//     else if (currentUser.active === 0) {
//         res.send(alertmove('/', '이용이 정지된 계정입니다'))
//         req.session.destroy(() => {
//             req.session;
//         });
//         res.redirect('/')
//     }
//     else {
//         next()
//     }
// }

// 관리자 확인 미들웨어
// const AdminAccess = (req, res, next) => {
//     let { currentUser } = req.session
//     if (currentUser.level > 1) {
//         next()
//     }
//     else {
//         res.send(alertmove('/', '관리자 전용 기능입니다'))
//     }
// }