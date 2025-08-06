import { CookieOptions, Response } from "express"
import { fifteenMinuteFromNow, thirtyDaysFromNow } from "./Date"

const secure = process.env.NODE_ENV  !== 'development'
export const REFRESH_PATH = '/auth/refresh';

const defaults: CookieOptions = {
    sameSite : secure ? 'none' : 'lax',
    httpOnly : true,
    secure : secure
}

export const getAccessTokenCookieOptions = () : CookieOptions => ({
    ...defaults,
    expires : fifteenMinuteFromNow()
})

export const getRefreshTokenCookieOptions = () : CookieOptions => ({
    ...defaults,
    expires : thirtyDaysFromNow(),
    path : REFRESH_PATH
})

type Params = {
    res : Response,
    accessToken: string,
    refreshToken : string
}

export const setAuthCookies = ({res, accessToken, refreshToken} : Params) => 
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions()).cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res : Response) => 
    res.clearCookie('accessToken').clearCookie('refreshToken', {path : REFRESH_PATH })
