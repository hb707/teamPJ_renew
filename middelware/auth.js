const { verifyJWT, decoding } = require('../util/jwt')

const auth = (req, res, next) => {
    // 1. jwt 확인 
    // 2. active 상태 확인
    const { AccessToken } = req.cookies
    try {
        // 토큰확인
        if (!verifyJWT(AccessToken)) {
            console.log('인증이 되지 않은 토큰입니다.');
            throw new Error('JWT token error')
        }
        // 이용가능상태 확인
        const currentUser = decoding(AccessToken)
        if (currentUser.active !== 1) { console.log('사용중지된 계정입니다.'); throw new Error('Active error') }

        next()
    }
    catch (e) { console.log(e); throw e }
}

const authAdmin = (req, res, next) => {
    // level 확인
    const { AccessToken } = req.cookies
    const currentUser = decoding(AccessToken)
    if (currentUser.level !== 3) { console.log('관리자 권한이 없는 계정입니다.'); throw new Error('Admin auth error') }
    next()
}





module.exports = { auth, authAdmin }