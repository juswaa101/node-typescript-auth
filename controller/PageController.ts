import { NextFunction, Request, Response } from "express";
import { LocalStorage } from "node-localstorage";

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

}

export default PageController;