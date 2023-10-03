import nodemailer from "nodemailer";
import ResponseHelper from "../config/ResponseHelper";
import { Response } from "express";
import dotenv from "dotenv";

dotenv.config();

class EmailService {

    response: ResponseHelper;

    constructor() {
        this.response = new ResponseHelper();
    }

    // logic for sending email
    sendMail = (res: Response, from: string, to: string | undefined, subject: string, html: string) => {
        return new Promise((resolve, reject) => {
            // email credentials for setting up
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env?.EMAIL_USERNAME,
                    pass: process.env?.EMAIL_PASSWORD
                }
            });

            // mail details
            let mailDetails: Object = {
                from,
                to,
                subject,
                html,
            };

            // send email
            mailTransporter.sendMail(mailDetails, (err, data) => {
                if (err) {
                    reject(this.response.error(res, 500, "Error Occurs"));
                } else {
                    resolve(this.response.success(res, 200, "Email sent successfully"));
                }
            });
        });

    }

}

export default EmailService;