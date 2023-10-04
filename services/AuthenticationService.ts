import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";
import dotenv from "dotenv";
import db from "../config/Database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ResponseHelper from "../config/ResponseHelper";
import EmailService from "./EmailService";

dotenv.config();
global.localStorage = new LocalStorage('./scratch');

class AuthenticationService {

    response: ResponseHelper;
    emailService: EmailService;

    constructor() {
        this.response = new ResponseHelper();
        this.emailService = new EmailService();
    }

    loginService = (
        res: Response,
        email: string,
        password: string
    ): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            // find user credentials in the database
            db.query("SELECT * FROM users WHERE email = ? AND verify_token IS NOT NULL", [email], async (err, results) => {
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
                        // assign token to user
                        const user_id = results[0].id;
                        const token = jwt.sign(
                            { user_id: user_id, email },
                            process.env.ACCESS_TOKEN_SECRET as string,
                            {
                                expiresIn: "1h",
                            }
                        );

                        // store email and user token
                        localStorage.setItem("email", email);
                        localStorage.setItem("_token", token);
                        resolve(this.response.success(res, 200, "Credentials match!", [{ token, results, login: true }]));
                    }
                    else {
                        resolve(this.response.error(res, 401, "Password is not correct"));
                    }
                }
                else {
                    resolve(this.response.error(res, 401, "Email doesn't exist yet or it is not verified yet!"));
                }
            });
        });
    }

    registerService = (
        req: Request,
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
                this.emailCheckUniqueService(req, res, results, email, user);
            });
        });
    }

    emailCheckUniqueService = (
        req: Request,
        res: Response,
        results: any,
        email: string | undefined,
        user: Object
    ): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            // check if email not exists
            if (results.length === 0) {
                // insert credentials to the database
                db.query("INSERT INTO users SET ?", [user], async (err, result) => {
                    // if error occurs, throw an exception
                    if (err) {
                        resolve(this.response.error(res, 500, "Register query fails!"));
                        return;
                    }

                    // mail details
                    let id: any = result.insertId;
                    let sender: string = "express@jwt.com";
                    let recipient: string | undefined = email?.toString();
                    let subject = "Account Verification";
                    let html = `<p>Please verify your email here to verify your account</p> <br/> Copy this link to url: ${req.headers.host}/verification-page/${id}`;

                    // send verification email to user registered
                    await this.emailService.sendMail(res, sender, recipient, subject, html);
                });
            }
            else {
                resolve(this.response.error(res, 409, "Email already exists"));
            }
        });
    }

    sendPasswordResetToUserVerified = (req: Request, res: Response, email: string): void => {
        db.query("SELECT * FROM users WHERE email = ? AND verify_token IS NOT NULL", [email], async (err, results) => {
            // if finding of verified user query fails throw an error
            if (err) {
                this.response.error(res, 500, "Finding verified user fails");
            }

            // if there is user verified, then send an email
            if (results.length > 0) {
                // mail details
                let sender: string = "express@jwt.com";
                let recipient: string | undefined = email;
                let subject = "Password Reset";
                let html = `<p>Thanks for requesting a password reset!</p> <br/> Copy this link to url: ${req.headers.host}/reset-password/${results[0].verify_token}`;

                // send verification email to user that has requested the password reset
                await this.emailService.sendMail(res, sender, recipient, subject, html);
            }
        });
    }

    verifyTokenValidityService = (req: Request, res: Response, hash_password: string, verify_token: string): void => {
        db.query("SELECT * FROM users WHERE verify_token = ?", [verify_token], (findError, findResult) => {
            // if finding verify token fails throw error
            if (findError) {
                this.response.error(res, 500, "Finding existing user with token fails");
            }

            // if verify token still exists in the database
            if (findResult.length > 0) {
                // update the password with whom verify token it is
                db.query("UPDATE users SET password = ? WHERE verify_token = ?", [hash_password, verify_token],
                    (updatePasswordError, updatePasswordResult) => {
                        // if there is an error updating the user password
                        if (updatePasswordError) {
                            this.response.error(res, 500, "Updating users password query fails");
                        }
                        this.response.success(res, 200, "Password changed successfully!");
                    });
            }
            else {
                this.response.error(res, 404, "This verify token isnt existing anymore");
            }
        });
    }
}

export default AuthenticationService;