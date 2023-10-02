import mysql, { MysqlError } from "mysql";

export = (() => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'jwt-auth'
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
