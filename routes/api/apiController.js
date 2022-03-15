const pool = require('../../models/db').pool

const apiList = async (req, res) => {
    const sql = `select idx,subject,nickname,content,DATE_FORMAT(date,'%Y-%m-%d') as date,hit from board order by idx desc`
    const sql2 = `SELECT count(idx) as totalRecord from board`
    let response = {
        errno: 1
    }
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.execute(sql)
        const [result2] = await conn.execute(sql2)
        response = {
            ...response,
            errno: 0,
            result: result,
            totalRecord: result2[0].totalRecord
        }
        res.json(response)
    } catch (e) {
        console.log(e)
        res.json(response)
    } finally { conn.release() }
}

module.exports = {
    apiList,
}