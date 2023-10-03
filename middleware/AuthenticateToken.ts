import { Request, Response, NextFunction } from "express";
import { LocalStorage } from "node-localstorage";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ResponseHelper from "../config/ResponseHelper";

dotenv.config();
global.localStorage = new LocalStorage('./scratch');

declare global {
    namespace Express {
        interface Request {
            user: object;
        }
    }
}

export = (() => {
    const response = new ResponseHelper();

    // logic for authenticate token
    const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = localStorage.getItem("_token") ?? "";

            // check if token is not existing
            // otherwise it is unauthenticated
            if (!token) {
                return res.redirect("/login")
            };

            // verify user token
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
                // check if there is an error
                if (err) {
                    return res.redirect("/login");
                }
                else {
                    /* 
                        set user to user request object and 
                        proceed to next request 
                    */
                    req.user = user
                    next();
                }
            });
        }
        catch (e) {
            return response.error(res, 500, "Something went wrong");
        }
    }

    return authenticateToken;
})();