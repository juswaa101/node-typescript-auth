import express, { Router } from "express";
import PageController from "../controller/PageController";
import checkIfUserIsAuthenticated from "../middleware/checkIfUserIsAuthenticated";

export = (() => {
    const app: Router = express.Router();
    const pageController: PageController = new PageController();

    app.get("/login", pageController.loginPage);
    app.get("/register", pageController.registerPage);
    app.get("/welcome", checkIfUserIsAuthenticated, pageController.welcomePage);

    return app;
})();