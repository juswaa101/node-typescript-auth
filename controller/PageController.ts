import { NextFunction, Request, Response } from "express";
import { LocalStorage } from "node-localstorage";
import dotenv from "dotenv";
import db from "../config/Database";
import Cryptr from "cryptr";

dotenv.config();
global.localStorage = new LocalStorage('./scratch');

class PageController {

    loginPage = (req: Request, res: Response): void => {
        res.render("login");
    };

    registerPage = (req: Request, res: Response): void => {
        res.render("register");
    }

    welcomePage = (req: Request, res: Response, next: NextFunction): void => {
        res.render("welcome");
    }

    verificationPage = (req: Request, res: Response): void => {
        try {
            // set secret key of cryptr
            const cryptr = new Cryptr(process.env.ACCESS_TOKEN_SECRET as string ?? "");

            let id: string = cryptr.decrypt(req.params?.id);

            // find not verified user yet in database
            db.query("SELECT * FROM users WHERE id = ? AND verify_token IS NULL", [id], (err, result) => {
                // if there is an error, throw it
                if (err) {
                    return;
                }

                // if there is a user existing without verify token
                if (result.length > 0) {
                    // redirect to verification page
                    res.render("verify-account", { id });
                }
                // otherwise, user has already verify token
                else {
                    // redirect back to login
                    res.render("./errors/404");
                }
            });
        }
        catch (e) {
            res.render("./errors/500");
        }
    }

    forgotPasswordPage = (req: Request, res: Response): void => {
        res.render("forgot-password");
    }

    resetPasswordPage = (req: Request, res: Response): void => {
        let verify_token: string = req.params?.verify_token;
        res.render("reset-password", { verify_token });
    }

}

export default PageController;