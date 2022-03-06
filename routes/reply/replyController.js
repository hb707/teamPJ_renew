const pool = require('../../models/db').pool
//const { decoding } = require('../../util/jwt')


const writePost = async (req, res) => {

    const conn = await pool.getConnection()
    try {
        const replyObj = { ...req.body }
        replyObj.bidx = parseInt(replyObj.bidx)
        const sql = `INSERT INTO replydb(bidx,bid, cid, reply, replydate, replylike) values(?,?,?,?,now(),0) ;`
        const [result] = await conn.query(sql, Object.values(replyObj))
        res.redirect(`/board/view?idx=${replyObj.bidx}`)
    }
    catch (error) {
        console.log('reply write post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

const likePost = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const replyObj = { ...req.body } //bidx, cidx, replylike
        console.log(replyObj)
        replyObj.bidx = parseInt(replyObj.bidx)
        replyObj.cidx = parseInt(replyObj.cidx)
        replyObj.replylike = parseInt(replyObj.replylike) + 1
        console.log(replyObj)
        const sql = `UPDATE replydb SET replylike=${replyObj.replylike} WHERE cidx=${replyObj.cidx}`
        const [result] = await conn.query(sql)
        // 조회수 -1 처리해주기 (댓글달고 리디렉션 할 때는 글 조회수 올라가지 않게)
        res.redirect(`/board/view?idx=${replyObj.bidx}`)
    }
    catch (error) {
        console.log('reply like post 에러')
        res.status(500).send('<h1>Internal Server Error</h1>')
    }
    finally { conn.release() }
}

//const editGet = (req, res) => { }

//const editPost = (req, res) => { }

//const deletePost = (req, res) => { }

module.exports = {
    writePost,
    likePost,

}

// editGet,
//     editPost,
//     deletePost