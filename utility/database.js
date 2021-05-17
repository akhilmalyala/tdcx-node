let mysql = require('mysql');
let pool = null;
let util = require('util');

module.exports = {
    getMysqlPool: function () {

        if(pool){
            return pool;
        }

        pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.DB_USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            multipleStatements: true,
            wait_timeout : 1440,
            acquireTimeout : 60 * 60 * 1000,
            connectTimeout  : 60 * 60 * 1000,
            timeout         : 60 * 60 * 1000
        });

        pool.getConnection((err, connection) => {

            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }
            }

            if (connection) {
                connection.release();
            }
        });

        pool.query = util.promisify(pool.query).bind(pool);
        return pool;
    }
};