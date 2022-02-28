require('dotenv').config()
const mysql2 = require('mysql2')

const host = process.env.DB_HOST || 'localhost'
const user = process.env.DB_USER || 'hanbin'
const password = process.env.DB_PASSWORD || 'hanbin00'
const database = process.env.DB_DATABASE || 'homepage2'


const config = { host, user, password, database, connectionLimit: 5 }
const pool = mysql2.createPool(config)
const promisePool = pool.promise()

exports.pool = promisePool