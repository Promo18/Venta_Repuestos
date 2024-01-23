const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 3,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'DB_joymer'
})

module.exports= pool