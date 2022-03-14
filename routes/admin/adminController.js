const { alertmove } = require('../../util/alert')
const pool = require('../../models/db').pool

const adminUserGet = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const sql = `SELECT userId, userPw, userName, nickname, gender, phonenumber, level, active FROM userdb`
        const [result] = await conn.query(sql)
        res.render('admin/adminUser', { list: result })
    }
    catch (error) {
        console.log('admin user get 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

const adminUserPost = async (req, res) => {
    const { userId, level, active } = { ...req.body }
    const conn = await pool.getConnection()
    try {
        const sql = `UPDATE userdb SET level=${level},active=${active} WHERE userid='${userId}'`
        const [result] = await conn.query(sql)
        res.redirect('/admin/user')
    }
    catch (error) {
        console.log('admin user post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

const adminBoardGet = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const sql = `select idx,subject,nickname,content,DATE_FORMAT(date,'%Y-%m-%d') as date,hit from board`
        const [result] = await conn.query(sql)
        res.render('admin/adminBoard', { list: result })
    }
    catch (error) {
        console.log('admin board get 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}


const adminBoardPost = async (req, res) => {
    let select = req.body;
    let keylist = Object.keys(select);
    let idxStr = ""

    keylist.forEach(v => { idxStr = idxStr + v.slice(5,) + ','; })

    idxStr = idxStr.slice(0, -1);
    let idxArr = idxStr.split(',')

    const conn = await pool.getConnection()
    try {
        if (idxStr === '') { res.send(alertmove('/admin/board', '삭제할 게시글을 선택해주세요')) }
        else {
            let deleteSql1 = `DELETE from board WHERE idx in (${idxStr});`
            let deleteSql2 = `ALTER TABLE board AUTO_INCREMENT=1;`
            let deleteSql3 = `SET @COUNT = 0;`
            let deleteSql4 = `UPDATE board SET idx = @COUNT:=@COUNT+1;`

            const [result1] = await conn.query(deleteSql1)
            const [result2] = await conn.query(deleteSql2)
            const [result3] = await conn.query(deleteSql3)
            const [result4] = await conn.query(deleteSql4)

            console.log(idxArr)

            for (let i = 0; i < idxArr.length; i++) {
                let idx = parseInt(idxArr[i])
                let replyDeleteSql1 = `DELETE from replydb WHERE bidx=${idx};`
                let replyDeleteSql2 = `update replydb set bidx=bidx-1 where bidx>${idx};`
                let replyDeleteSql3 = `ALTER TABLE replydb AUTO_INCREMENT=1;`
                let replyDeleteSql4 = `SET @COUNTR = 0;`
                let replyDeleteSql5 = `UPDATE replydb SET cidx = @COUNTR:=@COUNTR+1;`
                const [replyResult1] = await conn.execute(replyDeleteSql1)
                const [replyResult2] = await conn.execute(replyDeleteSql2)
                const [replyResult3] = await conn.execute(replyDeleteSql3)
                const [replyResult4] = await conn.execute(replyDeleteSql4)
                const [replyResult5] = await conn.execute(replyDeleteSql5)
            }


            res.redirect('/admin/board')
        }
    }
    catch (error) {
        console.log('admin board post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}


module.exports = {
    adminUserGet,
    adminUserPost,
    adminBoardGet,
    adminBoardPost
}