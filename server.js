require('dotenv').config()
const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const session = require('express-session')
const Memorystore = require('memorystore')(session)
const router = require('./routes/index')
const PORT = parseInt(process.env.PORT) || 3000

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

const MenuChange = (req, res, next) => {
    const { currentUser } = req.session
    if (currentUser != undefined) {
        res.locals.checkLogin = 1
        next()
    } else {
        res.locals.checkLogin = 0
        next()
    }
}

app.use(session(sessionObj))
app.use(express.urlencoded({ extended: true, }))
app.use(express.static('public'))
app.use(MenuChange) // 모든 라우터에 checkLogin 인자 전달
app.use(router)

app.listen(3000, () => { console.log("서버시작") })