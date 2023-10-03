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

    verificationPage = (req: Request, res: Response): void => {
        res.render("verify-account", { id: req.params?.id });
    }

    forgotPasswordPage = (req: Request, res: Response): void => {
        res.render("forgot-password");
    }

    resetPasswordPage = (req: Request, res: Response): void => {
        res.render("reset-password", { verify_token: req.params.verify_token });
    }

}

export default PageController;