import mysql, { MysqlError } from "mysql";
import dotenv from "dotenv";

dotenv.config();

export = (() => {
    const connection = mysql.createConnection({
        host: process.env?.DB_HOST,
        user: process.env?.DB_USER,
        password: process.env?.DB_PASSWORD,
        database: process.env?.DB_NAME,
    });

    connection.connect((err: MysqlError) => {
        if (err) {
            console.error(`${err}`);
            return;
        }
        console.log(`DB Connected!`);
    });

    return connection;
})();
