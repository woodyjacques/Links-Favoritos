const mysql = require('mysql');

const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === 'protocol_connection_lost'){
            console.error('database connection was closed');
        }
        if(err.code === 'er_con_count_error'){
            console.error('database has to many connections');
        }
        if(err.code === 'econnrefused'){
            console.error('database connection was refused');
        }
    }

    if(connection) connection.release();
    console.log('Base de datos conectado');
    return;
});

//promisify pool querys
pool.query = promisify(pool.query);

module.exports = pool;