const { alertmove } = require('../../util/alert')
const { createJWT, decoding } = require('../../util/jwt')
const pool = require('../../models/db').pool

// GET user/login
const loginGet = (req, res) => {
    res.render('user/login')
}

// POST user/login
const loginPost = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const userId = req.body.userId
        const userPw = req.body.userPw
        let CheckIdSql = `select userid, userpw, nickname, level, active from userdb`
        const [result] = await conn.query(CheckIdSql)
        const [matchUser] = result.filter(v => v.userid === userId && v.userpw === userPw)
        // 일치하는 계정이 있다면 세션생성, 그렇지 않다면 alert 띄우기
        if (matchUser !== undefined) {
            delete matchUser.userpw

            //req.session.currentUser = { ...matchUser }
            // JWT로 변경
            const payload = { ...matchUser }
            const jwt = createJWT(payload)
            const maxAge = 60 * 60 * 1000
            const cookieOption = {
                path: '/',
                httpOnly: true,
                maxAge: maxAge
            }
            res.cookie('AccessToken', jwt, cookieOption)
            const nickname = matchUser.nickname
            res.send(alertmove('/', `${nickname}님, 로그인 되었습니다.`))
        }
        else { res.send(alertmove('/user/login', '아이디와 패스워드를 확인해주세요.')) }
    }
    catch (error) {
        console.log('로그인 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

const loginFacebookGet = (req, res) => {
    console.log("이거실행")
    const maxAge = 60 * 60 * 1000
    const cookieOption = {
        path: '/',
        httpOnly: true,
        maxAge: maxAge
    }
    res.cookie('AccessToken', req.user.myToken, cookieOption)
}



// GET user/join
const joinGet = (req, res) => {
    const user = req.session.currentUser
    if (user === undefined) { res.render('user/join') }
    else { res.send(alertmove('/', '이미 로그인된 상태입니다.')) }
}

// 회원가입 양식확인 함수 -> join POST에서 사용
const checkJoin = (joinFormObject) => {
    // 1. 빈 칸 없는지 체크
    const content = Object.values(joinFormObject)
    content.forEach(v => {
        if (v == undefined) {
            return false
        }
    })
    // 2. 비밀번호 일치하는지 체크
    if (content[1] !== content[2]) {
        return false
    }
    // 3. 핸드폰 번호 자릿수 확인
    if (content[6].length !== 11) {
        return false
    }
    return true
}


// POST user/join ***변경필요
const joinPost = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const joinFormObject = {
            ...req.body,
            level: parseInt(req.body.level),
            active: parseInt(req.body.active)
        }

        // 1. 입력 양식 적합 확인
        if (!checkJoin(joinFormObject)) {
            res.send(alertmove('/user/join', '입력내용을 확인해주세요'))
        }
        else {
            // 2. 아이디 중복 확인
            let IDconfirmSql = 'SELECT userid from userdb'
            let [result] = await conn.query(IDconfirmSql)
            const [idCheck] = result.filter(v => v.userid === joinFormObject.userId)
            if (idCheck !== undefined) {
                res.send(alertmove('/user/join', '이미 사용 중인 아이디입니다.'))
            }
            else {
                // 3. userdb에 추가하기
                delete joinFormObject.checkPw
                let item = Object.values(joinFormObject)
                let insertSql = `INSERT INTO userdb(userid,userpw,username,nickname,gender,phoneNumber,level,active) VALUES(?,?,?,?,?,?,?,?)`
                const [result2] = await conn.query(insertSql, Object.values(joinFormObject))
                req.session.joinUser = joinFormObject
                res.send(alertmove('/user/welcome', `${joinFormObject.userId}님, 가입을 환영합니다.`))
            }
        }
    }
    catch (error) {
        console.log('회원가입 에러')
        console.log(error)
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally {
        conn.release()
    }
}

// GET user/welcome
const welcome = (req, res) => {
    const user = { ...req.session.joinUser }
    req.session.destroy(() => {
        req.session;
    });
    res.render('user/welcome', {
        item: user
    })
}

// GET user/profile
const profile = async (req, res) => {
    const { AccessToken } = req.cookies
    const currentUser = decoding(AccessToken)
    const conn = await pool.getConnection();
    try {
        if (currentUser === undefined) { res.send(alertmove('/user/login', '로그인 하신 후에 이용할 수 있습니다.')) }
        else {
            const currentId = currentUser.userid
            const sql = `SELECT * FROM userdb WHERE (userid='${currentId}')`
            const [result] = await conn.query(sql)
            const item = { ...result[0] }
            res.render('user/profile', { item })
        }
    }
    catch (err) {
        console.log('프로필 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
        throw err
    }
    finally { conn.release() }
}

// Get user/logout
const logout = (req, res) => {
    res.clearCookie('AccessToken', { path: '/' })
    res.redirect('/')
}

// POST user/userdelete
const userDelete = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const userId = req.body.userid
        const userDeleteSql = `delete from userdb where userid='${userId}';`
        const [result] = await conn.query(userDeleteSql)
        res.clearCookie('AccessToken', { path: '/' })
        res.send(alertmove('/', '회원탈퇴가 완료되었습니다.'))
    }
    catch (err) {
        console.log('회원탈퇴 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }

}






// ajax Controller
const idCheck = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const { userid } = req.body
        const Idsql = `select userid from userdb`
        const [idList] = await conn.query(Idsql)
        const [matchObj] = idList.filter(v => v.userid === userid)
        let usedId = 0
        if (matchObj == undefined) {
            usedId = 1
        }
        // 중복아이디가 있으면 0, 없으면 1
        const response = { usedId }
        res.send(JSON.stringify(response))
    }
    catch (err) {
        console.log('ID 중복체크 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}



module.exports = {
    loginGet,
    loginPost,
    loginFacebookGet,
    joinGet,
    joinPost,
    welcome,
    profile,
    logout,
    userDelete,
    idCheck
}