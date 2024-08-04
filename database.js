import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();
const env = process.env;

function ConnectSql() {
    let con = mysql.createConnection({
        host: env.HOST,
        user: env.USER,
        password: env.PASSWORD,
        database: env.DATABASE
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Sql Connected!");
    });
    return con;
}

function ExecuteQueryAsync(sql) {
    return new Promise((resolve, reject) => {
        const connectedCon = ConnectSql();
        connectedCon.query(sql, (err, result) => {
            if (err) {
                connectedCon.end();
                return reject(err);
            }
            console.log("Result: " + JSON.stringify(result));
            connectedCon.end();
            resolve(result);
        });
    });
}
function ExecuteSPAsync(sql) {
    return new Promise((resolve, reject) => {
        const connectedCon = ConnectSql();
        connectedCon.query(sql, (err, result) => {
            if (err) {
                connectedCon.end();
                return reject(err);
            }
            
            connectedCon.end();
            resolve(result[0]);
        });
    });
}

export {ConnectSql, ExecuteQueryAsync, ExecuteSPAsync};