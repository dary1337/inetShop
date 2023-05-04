import APIerror from "./APIerror.js";
import helper from '../helper.js'


export default function (err, req, res, next) {

    if (err instanceof APIerror)
        return res.status(err.status)
            .json({message: helper.upFirstChar(err.message)});
    
    return res.status(555).json({message:'unexcepted error'})
};