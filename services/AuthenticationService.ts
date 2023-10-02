import { Response } from "express";
import db from "../config/Database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ResponseHelper from "../config/ResponseHelper";

class AuthenticationService {

    response: ResponseHelper;

    constructor() {
        this.response = new ResponseHelper();
    }

    loginService = (
        res: Response,
        email: string,
        password: string
    ): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            // find user credentials in the database
            db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
                // if error occurs, throw an exception
                if (err) {
                    reject(this.response.error(res, 500, "Find email query fails!"));
                }

                // check if entered email already exists, 
                if (results.length > 0) {
                    // compares both input password and hashed password
                    const compare: boolean = await bcrypt.compare(password, results[0].password);

                    // check if password matches with the hash password
                    if (compare) {
                        // store email and _token to localStorage
                        localStorage.setItem("email", email);
                        localStorage.setItem("_token", results[0].token);
                        resolve(this.response.success(res, 200, "Credentials match!"));
                    }
                    else {
                        resolve(this.response.error(res, 401, "Password is not correct"));
                    }
                }
                else {
                    resolve(this.response.error(res, 401, "Email does not exist"));
                }
            });
        });
    }

    registerService = (
        res: Response,
        user: Object,
        email: string | undefined
    ): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            // query existing email to the database
            db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
                if (err) {
                    reject(this.response.error(res, 500, "Searching email query fails!"));
                    return;
                }

                // call email check unique service
                this.emailCheckUniqueService(res, results, email, user);
            });
        });
    }

    emailCheckUniqueService = (
        res: Response,
        results: any,
        email: string | undefined,
        user: Object
    ): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            // check if email not exists
            if (results.length === 0) {
                // insert credentials to the database
                db.query("INSERT INTO users SET ?", [user], (err, result) => {
                    // if error occurs, throw an exception
                    if (err) {
                        resolve(this.response.error(res, 500, "Register query fails!"));
                        return;
                    }

                    // assign token to the user
                    const user_id = result.insertId;
                    const token = jwt.sign(
                        { user_id: user_id, email },
                        "secret",
                        {
                            expiresIn: "2h",
                        }
                    );

                    // assign the token to the user in the database
                    db.query("UPDATE users SET token = ? WHERE id = ?", [token, user_id], (err) => {
                        // if error occurs, throw an exception
                        if (err) {
                            reject(this.response.error(res, 500, "Token authorization query fails"));
                            return;
                        }
                    });

                    resolve(this.response.success(res, 200, "Register Successfully!"));
                });
            }
            else {
                resolve(this.response.error(res, 409, "", [{ email: 'Email already exists' }]));
            }
        });
    }
}

export default AuthenticationService;