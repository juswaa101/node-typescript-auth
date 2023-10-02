import { Request, Response, NextFunction } from "express";
import { LocalStorage } from "node-localstorage";

global.localStorage = new LocalStorage('./scratch');

export = (() => {
    // check if user is logged in
    const checkUserSession = (req: Request, res: Response, next: NextFunction) => {
        // check if user token is empty
        if (localStorage.getItem("_token") === null) {
            res.redirect("/login");
        }
        else {
            next();
        }
    };

    return checkUserSession;
})();