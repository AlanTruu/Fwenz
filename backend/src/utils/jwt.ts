import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model"
import { UserDocument } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

export type RefreshTokenPayload = {
    sessionID  : SessionDocument['_id'] 
};

export type AccessTokenPayload = {
    sessionID  : SessionDocument['_id'],
    userID : UserDocument['_id']
};

export type SignOptionsAndSecret = SignOptions & {secret : string};

const defaults : SignOptions = {
    audience : 'user',
}

export const accessTokenSignOptions : SignOptionsAndSecret = {
    expiresIn : '15m',
    secret : JWT_SECRET
}

export const refreshTokenSignOptions : SignOptionsAndSecret = {
    expiresIn : '30d',
    secret : JWT_REFRESH_SECRET
}

export const signToken = (payload : 
    AccessTokenPayload | RefreshTokenPayload,
    options?: SignOptionsAndSecret
) => {
    const {secret, ...signOpts} = options || accessTokenSignOptions
    return jwt.sign(payload, secret, {audience: 'user', ...signOpts})
}

export const verifyToken = <TPayload extends Object = AccessTokenPayload>(
    token : string,
    options ?: VerifyOptions & {secret : string}
) => {
    const {secret = JWT_SECRET, ...verifyOpts} = options || {}

    try {
        const payload = jwt.verify(token, secret, {audience: 'user', ...verifyOpts}) as unknown as TPayload;
        return {payload}
    }
    catch (err : any) {
        return {error : err.message}
    }
}