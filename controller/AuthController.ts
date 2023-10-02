import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";
import { Result, ValidationError, validationResult } from "express-validator";
import ResponseHelper from "../config/ResponseHelper";
import AuthenticationService from "../services/AuthenticationService";
import bcrypt from "bcrypt";

global.localStorage = new LocalStorage('./scratch');

class AuthController {

    response: ResponseHelper;
    auth: AuthenticationService;

    constructor() {
        this.response = new ResponseHelper();
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
                await this.auth.registerService(res, user, email)
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

}

export default AuthController;