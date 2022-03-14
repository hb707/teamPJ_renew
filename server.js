require('dotenv').config()
const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const session = require('express-session')
const Memorystore = require('memorystore')(session)
const router = require('./routes/index')
const PORT = parseInt(process.env.PORT) || 3000
const menuChange = require('./middelware/menuChange')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const fbStrategy = require('passport-facebook').Strategy

app.set('view engine', 'html')
nunjucks.configure('views', { express: app })

const maxAge = 60 * 60 * 1000 // 1hour
let sessionObj = {
    secret: "teamPJ",
    resave: false,
    saveUninitialized: true,
    store: new Memorystore({ checkPeriod: maxAge }),
    cookie: {
        maxAge: maxAge
    }
}



app.use(session(sessionObj))
app.use(express.urlencoded({ extended: true, }))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(passport.initialize())
// app.use(passport.session()) // 반드시 32줄의 app.use(session(obj))의 다음에 작성해야함. jwt방식에도 필요한...지?
app.use(menuChange) // 모든 라우터에 checkLogin 인자 전달하는 미들웨어
app.use(router)

app.listen(3000, () => { console.log("서버시작") })