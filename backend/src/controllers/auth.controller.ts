import { NextFunction, Request, RequestParamHandler, Response } from 'express'
import {z} from 'zod'
import { createAccount, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from '../services/auth.service'
import { setAuthCookies, clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '../utils/cookies'
import { registerSchema, loginSchema, verificationCodeSchema, emailSchema, resetPasswordSchema } from './auth.schemas'
import { loginUser } from '../services/auth.service'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants/env'
import { verifyToken } from '../utils/jwt'
import SessionModel from '../models/session.model'
import appAssert from '../utils/appAssert'
import { UNAUTHORIZED, OK } from '../constants/http'



export const registerHandler = async (req : Request, res : Response, next : NextFunction) => {
    //validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent : req.headers['user-agent']
    })

    //service
    const {user, refreshToken, accessToken} = await createAccount(request);
    
    //return
    return void setAuthCookies({res, accessToken, refreshToken}).status(201).json(user)
}

export const loginHandler = async (req : Request, res: Response) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent : req.headers['user-agent']
    })

    const {user, refreshToken, accessToken} = await loginUser(request);

    return void setAuthCookies({res, accessToken, refreshToken}).status(201).json({message : 'login successful'});
}

export const logoutHandler = async (req : Request, res : Response) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    const {payload} = verifyToken(accessToken || "");

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionID);
    }

    return void clearAuthCookies(res).status(201).json({message : 'logout successful'});
}

export const refreshHandler = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    const {accessToken, newRefreshToken} = await refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
        res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
    }

    return void res.status(OK).cookie('accessToken', accessToken, getAccessTokenCookieOptions()).json({
        message : 'Access token refreshed'
    })
}

export const verifyEmailHandler = async (req : Request, res : Response ) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);
    
    await verifyEmail(verificationCode);

    return void res.status(OK).json({
        message : 'Email was successfully verified'
    })
}

export const sendPasswordResetHandler = async (req : Request, res : Response) => {
    const email = emailSchema.parse(req.body.email);
    await sendPasswordResetEmail(email);

    return void res.status(OK).json({message : 'Password reset email sent'})
}

export const resetPasswordHandler = async (req : Request, res : Response) => {
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);

    return void clearAuthCookies(res).status(OK).json({message : 'Password reset successful'})
}