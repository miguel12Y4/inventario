const mysql = require('mysql');
const {database} = require('./keys.js');


const pool = mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTIONS WAS CLOSED')
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTIONS WAS REFUSED')
        }
        console.error('error en conexion con base de datos')
        return;
    }
    if(connection) connection.release();
    console.log('Base de datos conectada')
    return;
});


module.exports = pool