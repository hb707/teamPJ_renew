const passport = require('passport')
const jwt = require('jwt')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt;
const pool = require('../models/db').pool
require('dotenv').config


const passportConfig = { usernameField: 'userId', passwordField: 'userPw' };

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SALT,
    algorithms: ['HS256']
}

// 콜백함수
const jwtCallback = async (jwtPayload, done) => {
    const conn = await pool.getConnection()
    try {
        const userId = jwtPayload.userId
        const userPw = req.body.password
        let CheckIdSql = `select userid, userpw, nickname, level, active from userdb`
        const [result] = await conn.query(CheckIdSql)
        const [matchUser] = result.filter(v => v.userid === userId && v.userpw === userPw)
        // 일치하는 계정이 있다면 세션생성, 그렇지 않다면 alert 띄우기
        if (matchUser !== undefined) {
            return done(null, user)
        }
        else { return done(null, false) }
    }
    catch (error) {
        // db통신에서 에러 발생 시 
        done(error, null)
    }
    finally { conn.release() }
}


passport.use(new JwtStrategy(opts, jwtCallback))
// jwt전략에서 사용할 jwt옵션과 해당 토큰값으로 사용자를 검색하는 콜백함수가 인자로 들어감

const passportLogin = passport.authenticate(
    'jwt',
    {
        successRedirect: '/', // 로그인 성공시 이동화면
        failureRedirect: '/user/login', // 로그인 실패시 이동화면
        failureFlash: false // 로그인 실패시 메세지 띄우는 기능 <- 나중에 공부해보기
    }
)

// passport.authenticate의 첫번째 인자 : passport.use()에 있는 전략 콜백함수가 실행




module.exports = { passportLogin }