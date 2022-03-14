const req = require('express/lib/request')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { serializeUser } = require('passport/lib')
const FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config


passport.serializeUser(function (user, done) {
    console.log("이거실행됐다!")
    req.user = { ...user }
    done( )
})

passport.deserializeUser(function (id, done) {
    U
})

passport.use(new FacebookStrategy(
    {
        clientID: 1103888037096872,
        clientSecret: '93ceca88d95178bc0da848ab32b75420',
        callbackURL: "/user/login2/callback",
    },
    function (accessToken, refreshToken, profile, done) {
        // 1. 받아온 아이디가 db에 있는지 확인
        // 2. 있으면 jwt 생성 (return done(err, user))
        // 3. 없으면 db에 회원추가 후 로그인 (return done(null, user))
        const authId = 'facebook:' + profile.id
        // 페이로드 부분
        const user = {
            authId: authId,
            displayName: profile.displayName,
        }
        const payload = { ...user, }

        let secretOrPrivateKey = process.env.SALT
        let options = { expiresIn: 60 * 60 * 12 }
        try {
            const token = jwt.sign(payload, secretOrPrivateKey, options)
            user.myToken = token
            console.log(user)
            return done(null, user) // 로그인 성공
        }
        catch (err) {
            return done(err, null) // 로그인 실패
        }

        /*
         console.log(profile) 출력 :
         {
            id: '102190419100857', <- facebook상의 id값❗️ 매우 중요. 이 정보를 바탕으로 사용자를 추가하면 됨
            username: undefined,
            displayName: 'Bin Han',
            name: {
                familyName: undefined,
                givenName: undefined,
                middleName: undefined
            },
            gender: undefined,
            profileUrl: undefined,
            provider: 'facebook',
            _raw: '{"name":"Bin Han","id":"102190419100857"}',
            _json: { name: 'Bin Han', id: '102190419100857' }
        }
*/
    }
))

const passportFacebook = passport.authenticate('facebook', { scope: ['email'] })

// facebook 갔다가 사용자 확인 후 발생하는 콜백
const passportFacebookCallback = passport.authenticate(
    'facebook',
    {
        session: false,
        successRedirect: '/',
        failureRedirect: '/user/login'
    }
)


module.exports = { passportFacebook, passportFacebookCallback }