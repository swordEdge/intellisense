// import node modules
import { Request, Response } from 'express';

// import constants
import { MESSAGES, ERRORS } from '../constants';

export const calculate = async (req: Request, res: Response) => {
    try {
        console.log(MESSAGES.SIGNUP_SUCCESS);

    } catch (error) {
        console.log(error);
        console.log(MESSAGES.UNKNOWN_ERROR);
    }
};