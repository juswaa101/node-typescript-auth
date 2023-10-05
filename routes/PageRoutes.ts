import express, { Router } from "express";
import PageController from "../controller/PageController";
import AuthenticateToken from "../middleware/AuthenticateToken";

export = (() => {
    const app: Router = express.Router();
    const pageController: PageController = new PageController();

    // authentication page endpoints
    app.get("/login", pageController.loginPage);
    app.get("/register", pageController.registerPage);
    app.get("/verification-page/:id", pageController.verificationPage);
    app.get("/forgot-password", pageController.forgotPasswordPage);
    app.get("/reset-password/:verify_token", pageController.resetPasswordPage);

    app.get("/welcome", AuthenticateToken, pageController.welcomePage);

    return app;
})();