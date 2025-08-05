import { RequestHandler } from "express";
import { UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";
import mongoose from "mongoose";

const authenticate : RequestHandler = (req, res, next) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(accessToken, UNAUTHORIZED, 'Not authorized', AppErrorCode.InvalidAccessToken);

    const {error, payload} = verifyToken(accessToken);
    appAssert(payload, UNAUTHORIZED, error === 'jwt expired' ? 'Token expired' : 'Invalid token', AppErrorCode.InvalidAccessToken);

    req.userID = payload.userID as mongoose.Types.ObjectId;
    req.sessionID = payload.sessionID as mongoose.Types.ObjectId;
    next();

    //problem: what if a user logs out on all accounts?
    //should I check for valid sessions?
}

export default authenticate;