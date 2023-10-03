import { Request, Response, NextFunction } from "express";
import { LocalStorage } from "node-localstorage";
import { Result, ValidationError, validationResult } from "express-validator";
import ResponseHelper from "../config/ResponseHelper";
import AuthenticationService from "../services/AuthenticationService";
import bcrypt from "bcrypt";
import db from "../config/Database";
import EmailService from "../services/EmailService";

global.localStorage = new LocalStorage('./scratch');

class AuthController {
    response: ResponseHelper;
    emailService: EmailService;
    auth: AuthenticationService;

    constructor() {
        this.response = new ResponseHelper();
        this.emailService = new EmailService();
        this.auth = new AuthenticationService();
    }

    // logic for login user
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            const formatError: Array<any> = errors.array().map(el => el['msg']);

            const { email, password } = req?.body;

            // check if there is any validation error
            if (!errors.isEmpty()) {
                this.response.error(res, 422, "", formatError)
            } else {
                // call login service
                await this.auth.loginService(res, email, password);
            }
        }
        catch (e) {
            this.response.error(res, 500, "Something went wrong!");
        }
    }

    // logic for register user
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            const formatError: Array<any> = errors.array().map(el => el['msg']);

            // check if there is any validation error
            if (!errors.isEmpty()) {
                this.response.error(res, 422, "", formatError)
            } else {
                let email: string | undefined = req.body?.email;
                let hash_password: string = await bcrypt.hash(req.body?.password, 10);

                const user: Object = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash_password,
                }

                // call register service
                await this.auth.registerService(req, res, user, email)
            }

        }
        catch (e) {
            this.response.error(res, 500, "Something went wrong!");
        }
    }

    // logic for logout
    logout = (req: Request, res: Response): void => {
        // check if email is existing in localstorage
        if (localStorage.getItem("email") != null) {
            localStorage.removeItem("email");
        }
        // check if token is existing in localstorage
        if (localStorage.getItem("_token") != null) {
            localStorage.removeItem("_token");
        }
        // redirect to login page
        res.redirect("/login");
    }

    // logic for account verification
    verifyAccount = (req: Request, res: Response): void => {
        try {
            let id = parseInt(req.params.id) ?? 0;
            let verify_token = require('crypto').randomBytes(32).toString('hex');

            db.query("SELECT * FROM users WHERE id = ? AND verify_token IS NULL", [id], (selectError, userResults) => {
                // check if there is error in finding a user that has a token already
                if (selectError) {
                    this.response.error(res, 500, "Finding of user that has a token fails");
                }

                // check if there is a user that dont have a verify token yet
                if (userResults.length > 0) {
                    db.query("UPDATE users SET verify_token = ? WHERE id = ?", [verify_token, id], (updateError, updateResult) => {
                        // check if there is error in updating a token
                        if (updateError) {
                            this.response.error(res, 500, "Update of verification token fails");
                        }
                        else {
                            this.response.success(res, 200, "Account verified");
                        }
                    });
                }
                else {
                    this.response.success(res, 409, "Account already verified");
                }
            });
        }
        catch (e) {
            this.response.error(res, 500, "Something went wrong!");
        }
    }

    // logic for sending an email password reset
    sendPasswordReset = (req: Request, res: Response): void => {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            const formatError: Array<any> = errors.array().map(el => el['msg']);

            const { email } = req.body;

            // check if there is any validation error
            if (!errors.isEmpty()) {
                this.response.error(res, 422, "", formatError);
            } else {
                // call login service
                // Find a user that is verified
                db.query("SELECT * FROM users WHERE email = ? AND verify_token IS NOT NULL", [email], async (userError, userResult) => {
                    // if there is error, throw it
                    if (userError) {
                        this.response.error(res, 500, "Finding a verified user query fails");
                    }

                    // if user is found and verified
                    if (userResult.length > 0) {
                        await this.auth.sendPasswordResetToUserVerified(req, res, email);
                    }
                    else {
                        this.response.error(res, 404, "Email is not found or it is not verified!");
                    }
                })
            }


        }
        catch (e) {
            this.response.error(res, 500, "Something went wrong!");
        }
    }

    // logic for password reset
    passwordReset = async (req: Request, res: Response): Promise<void> => {
        try {
            const { new_password, verify_token } = req.body;
            const errors: Result<ValidationError> = validationResult(req);
            const formatError: Array<any> = errors.array().map(el => el['msg']);

            // check if there is any validation error
            if (!errors.isEmpty()) {
                this.response.error(res, 422, "", formatError);
            } else {
                let hash_password = await bcrypt.hash(new_password, 10);
                db.query("UPDATE users SET password = ? WHERE verify_token = ?", [hash_password, verify_token],
                    (updatePasswordError, updatePasswordResult) => {
                        if (updatePasswordError) {
                            this.response.error(res, 500, "Updating users password query fails");
                        }
                        this.response.success(res, 200, "Password changed successfully!");
                    });
            }
        }
        catch (e) {
            this.response.error(res, 500, "Something went wrong!");
        }
    }
}

export default AuthController;