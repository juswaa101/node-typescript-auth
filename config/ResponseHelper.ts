import { Response } from "express";

class ResponseHelper {

    success = (
        res: Response,
        status: number = 200,
        message: string = "",
        data: Array<any> = []
    ): Object => {
        return res.json({ status, message, data });
    };

    error = (
        res: Response,
        status: number = 500,
        message: string = "",
        errors: Array<any> = []
    ): Object => {
        return res.json({ status, message, errors });
    }

}

export default ResponseHelper;