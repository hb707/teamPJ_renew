const pool = require('../../models/db').pool



const listGet = async (req, res) => {
    // 페이징 정리
    const pagenum = req.query.p
    const conn = await pool.getConnection()
    try {
        const sql = `select idx,subject,nickname,content,DATE_FORMAT(date,'%Y-%m-%d') as date,hit from board order by idx desc
        Limit ${(pagenum - 1) * 5},5`
        const [result] = await conn.query(sql)
        let page = pagenum
        let view_article = 10;
        let total_record = result.length;
        let total_pages = Math.ceil(total_record / view_article)
        let block_article = 10;
        let blocks = Math.ceil(total_pages / block_article)
        let current_block = Math.ceil(page / block_article)
        let pages = []
        for (let i = 1; i <= view_article; i++) {
            pages.push((current_block - 1) * view_article + (i))
        }
        res.render(`board/list`, {
            list: result,
            pages,
        })
    }
    catch (error) {
        console.log('board list get 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

const viewGet = async (req, res) => {
    const index = req.query.idx
    const curUserNickname = req.session.currentUser.nickname
    let myContent
    const sql = `select * from board WHERE idx=${index} ;`
    const sql2 = ` UPDATE board SET hit=hit+1 WHERE idx=${index}`
    const getReplySql = `select * from replydb WHERE bidx=${index} ;`
    const conn = await pool.getConnection()
    try {
        const [result2] = await conn.query(sql2)
        const [result] = await conn.query(sql)
        if (curUserNickname === result[0].nickname) { myContent = 1 }
        else { myContent = 0 }
        const [replydb] = await conn.query(getReplySql)
        res.render('board/view', { item: result[0], myContent, curUserNickname, replydb })
    }
    catch (error) {
        console.log('board view get 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

// 작업중
const viewPost = async (req, res) => {

    const conn = await pool.getConnection()
    try {
        const replyObj = { ...req.body }
        console.log(replyObj)
        replyObj.bidx = parseInt(replyObj.bidx)
        const sql = `INSERT INTO replydb(bidx,bid, cid, reply, replydate, replylike) values(?,?,?,?,now(),0) ;`
        console.log('여기까진 OK')
        const [result] = conn.query(sql, Object.values(replyObj))
        // db에 추가도 되는데 왜 그 직후에 에러가 날까???
        console.log('아마도 여기가 문제겠지')
        res.redirect(`/board/view?idx=${replyObj.bidx}`)
    }
    catch (error) {
        console.log('board view post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}


const writeGet = async (req, res) => {
    res.render('board/write')
}


const writePost = async (req, res) => {
    let { subject, content } = req.body
    let nickname = req.session.currentUser.nickname
    let schemafields = [subject, content, nickname]
    let sql1 = `
        INSERT INTO board(subject,content,nickname,date,hit) values(?,?,?,now(),0) ;`
    // 원래 이 뒤에 있던 sql문은 왜 써준거지??
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.query(sql1, schemafields)
        res.redirect(`/board/list?p=1`)
    }
    catch (error) {
        console.log('board write post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}


const deleteGet = async (req, res) => {
    // 권한확인
    const index = req.query.idx
    const conn = await pool.getConnection()
    try {
        // sql 문법 해석... 그리고 오류 나는 이유 뭐때문인지 ㅠㅠ
        let sql = `
            DELETE from board WHERE idx=${index} ; 
            ALTER TABLE board AUTO_INCREMENT=1 ; 
            SET @COUNT = 0 ; 
            UPDATE board SET idx = @COUNT:=@COUNT+1;
        `
        const [result] = await conn.query(sql)
        res.redirect(`/board/list?p=1`)
    }
    catch (error) {
        console.log('board delete 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}




const updateGet = async (req, res) => {
    const index = req.query.idx
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.query(`select * from board where idx='${index}'`)
        res.render('board/update', { list: result[0] })
    }
    catch (error) {
        console.log('board update get 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}


const updatePost = async (req, res) => {
    const board = req.body
    const sql = `UPDATE board SET subject='${board.subject}',content='${board.content}' WHERE idx=${board.idx}`
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.query(sql)
        res.redirect(`/board/view?idx=${board.idx}`)
    }
    catch (error) {
        console.log('board update post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}








module.exports = {
    listGet,
    viewGet,
    viewPost,
    writeGet,
    writePost,
    deleteGet,
    updateGet,
    updatePost
}