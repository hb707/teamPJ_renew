const pool = require('../../models/db').pool
const { decoding } = require('../../util/jwt')


const listGet = (req, res) => {
    res.render('board/list')
}

// const listGet = async (req, res) => {
//     // 페이징 정리
//     const pagenum = req.query.p
//     const conn = await pool.getConnection()
//     try {
//         const sql = `select idx,subject,nickname,content,DATE_FORMAT(date,'%Y-%m-%d') as date,hit from board order by idx desc
//         Limit ${(pagenum - 1) * 5},5`
//         const [result] = await conn.query(sql)
//         let page = pagenum
//         let view_article = 10;
//         let total_record = result.length;
//         let total_pages = Math.ceil(total_record / view_article)
//         let block_article = 10;
//         let blocks = Math.ceil(total_pages / block_article)
//         let current_block = Math.ceil(page / block_article)
//         let pages = []
//         for (let i = 1; i <= view_article; i++) {
//             pages.push((current_block - 1) * view_article + (i))
//         }
//         res.render(`board/list`, {
//             list: result,
//             pages,
//         })
//     }
//     catch (error) {
//         console.log('board list get 에러')
//         res.status(500).send('<h1>Internal Server Error</h1>')
//     }
//     finally { conn.release() }
// }

const viewGet = async (req, res) => {
    const index = req.query.idx
    const { AccessToken } = req.cookies
    const currentUser = decoding(AccessToken)
    const curUserNickname = currentUser.nickname
    let myContent
    const sql = `select * from board WHERE idx=${index} ;`
    const sql2 = ` UPDATE board SET hit=hit+1 WHERE idx=${index}`
    const getReplySql = `select bidx, cidx, bid, cid, reply, DATE_FORMAT(replydate,'%Y-%m-%d') as replydate, replylike from replydb WHERE bidx=${index} order by cidx desc;`
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




const writeGet = async (req, res) => {
    res.render('board/write')
}


const writePost = async (req, res) => {
    let { subject, content } = req.body
    const { AccessToken } = req.cookies
    const currentUser = decoding(AccessToken)
    let nickname = currentUser.nickname
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
        // 게시글 삭제하고 인덱스 정렬
        let deleteSql1 = `DELETE from board WHERE idx=${index};`
        let deleteSql2 = `ALTER TABLE board AUTO_INCREMENT=1;`
        let deleteSql3 = `SET @COUNT = 0;`
        let deleteSql4 = `UPDATE board SET idx = @COUNT:=@COUNT+1;`

        const [result1] = await conn.query(deleteSql1)
        const [result2] = await conn.query(deleteSql2)
        const [result3] = await conn.query(deleteSql3)
        const [result4] = await conn.query(deleteSql4)

        // 댓글 삭제하고 바뀐 게시글 인덱스로 수정🔥
        let replyDeleteSql1 = `DELETE from replydb WHERE bidx=${index};`
        let replyDeleteSql2 = `update replydb set bidx=bidx-1 where bidx>${index};`
        let replyDeleteSql3 = `ALTER TABLE replydb AUTO_INCREMENT=1;`
        let replyDeleteSql4 = `SET @COUNTR = 0;`
        let replyDeleteSql5 = `UPDATE replydb SET cidx = @COUNTR:=@COUNTR+1;`
        const [replyResult1] = await conn.execute(replyDeleteSql1)
        const [replyResult2] = await conn.execute(replyDeleteSql2)
        const [replyResult3] = await conn.execute(replyDeleteSql3)
        const [replyResult4] = await conn.execute(replyDeleteSql4)
        const [replyResult5] = await conn.execute(replyDeleteSql5)


        console.log(replyDeleteSql1)

        res.redirect(`/board/list?p=1`)
    }
    catch (error) {
        console.log(error)
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
    writeGet,
    writePost,
    deleteGet,
    updateGet,
    updatePost
}

