import express, { Express, Request, Response } from "express";
import AuthRoutes from "./routes/AuthRoutes";
import PageRoutes from "./routes/PageRoutes";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT

// set directory to public path
app.use(express.static("public"));

// allow to submit form
app.use(express.urlencoded({ extended: true }));

// set view engine as ejs
app.set("view engine", "ejs");

// set session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// listen to port
app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`);
});

// use routes
app.use(PageRoutes);
app.use(AuthRoutes);

// page not found route
app.use((req: Request, res: Response) => {
    res.render("404");
});
