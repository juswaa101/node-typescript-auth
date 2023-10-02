import express, { Router } from "express";
import AuthController from "../controller/AuthController";
import multer from "multer";
import { ValidationChain, body } from "express-validator";

export = (() => {
    const upload = multer();
    const app: Router = express.Router();
    const authController: AuthController = new AuthController();

    const loginValidation: Array<ValidationChain> = [
        body("email")
            .isEmail()
            .withMessage("Email is required, and use a valid email format"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password is required atleast 8 characters long"),
    ];

    const registerValidation: Array<ValidationChain> = [
        body("name")
            .notEmpty()
            .withMessage("Name is required"),
        body("email")
            .isEmail()
            .withMessage("Email is required, and use a valid email format"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password is required atleast 8 characters long"),
    ];

    // api endpoints for authentication
    app.post("/api/login-auth", upload.none(), loginValidation, authController.login);
    app.post("/api/register-auth", upload.none(), registerValidation, authController.register);
    app.get("/api/logout", authController.logout);

    return app;
})();