import { ErrorHandler } from "hono";
import { AppError } from "../../shared/errors/AppError";
import { logger } from "../../shared/logger/logger";


export const errorHandler: ErrorHandler =
(error, c) => {


    logger.error(
        "Application Error",
        {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
    );


    console.error(
        "APPLICATION ERROR:",
        error
    );



    if (error instanceof AppError) {

        return c.json(
            {
                success:false,

                error:{
                    code:error.code,
                    message:error.message
                }
            },

            error.statusCode as any

        );

    }



    return c.json(

        {
            success:false,

            error:{
                code:"INTERNAL_ERROR",

                message:
                    error.message ??
                    "Internal Server Error"
            }
        },

        500

    );


};