import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();
const env = process.env;
// let con;

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

async function ExecutePostAndGet(updateQuery, newIdQuery) {
    try {
        // Execute the consent form entry query
        const connectedCon = ConnectSql();
        await connectedCon.query(updateQuery);

        // Execute the query to get the newId
        return new Promise((resolve, reject) => {
            connectedCon.query(newIdQuery, (err, res) => {
                err && reject(err);
                connectedCon.end();
                resolve(res);
            });
        });
    } catch (err) {
        console.error("Error executing query:", err);
    }
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

export { ConnectSql, ExecuteQueryAsync, ExecuteSPAsync, ExecutePostAndGet };