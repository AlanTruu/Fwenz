import VerificationCodeType from "../constants/verificationCodeTypes";
import { UserModel } from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { oneYearFromNow, ONE_DAY_MS, thirtyDaysFromNow, fiveMinutesAgo, oneHourFromNow } from "../utils/Date";
import SessionModel from "../models/session.model";
import jwt from 'jsonwebtoken'
import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CONFLICT, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR, TOO_MANY_REQUESTS } from "../constants/http";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { REFRESH_PATH } from "../utils/cookies";
import { sendMail } from "../utils/sendMail";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates";
import { Session } from "node:inspector/promises";
import { hashValue } from "../utils/bcrypt";
import mongoose from 'mongoose';



type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
  };

export const createAccount = (async (data : CreateAccountParams ) => {
    //verify existing user doesn't exist
    const existingUser = await UserModel.exists({
        email : data.email,
    })

    appAssert(!existingUser, CONFLICT, 'Email already in use')
    //create user ifne
    const user = await UserModel.create({
         email : data.email,
         password : data.password
    })

    const uid = user._id;
    //create verification code
    const verificationCode = await VerificationCodeModel.create({
        userID : uid,
        type : VerificationCodeType.EmailVerification,
        expiresAt : oneYearFromNow()
    })

    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`
    
    const {error} = await sendMail({
        to : user.email,
        ...getVerifyEmailTemplate(url)
    }) 
    
    if (error) {
        console.error(error);
    }
    
    //create session
    const session = await SessionModel.create({
        userID : uid,
        userAgent : data.userAgent
    })
    //sign access/refresh token
    const refreshToken = signToken({sessionID : session._id}, refreshTokenSignOptions)
    
    const accessToken = signToken({userID : uid, sessionID : session._id})
    
    //return user and tokens

    return {user : user.omitPassword(), refreshToken, accessToken}
});

export type loginParams = {
    email : string,
    password : string,
    userAgent?: string
};


export const loginUser = async ({email, password, userAgent} : loginParams) => {
    // get the user by email
    //validate password
    //create session
    //sign access and refresh tokens

    const user = await UserModel.findOne({email});

    appAssert(user, UNAUTHORIZED, 'Invalid email or password');

    const isValid = await user.comparePassword(password);

    appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

    const userID = user._id;

    const session = await SessionModel.create({
        userID,
        userAgent
    })

    const sessionInfo = {
        sessionID : session._id,
    }

    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)
    const accessToken = signToken({...sessionInfo, userID})
    

    return {user : user.omitPassword(), refreshToken, accessToken}
}

export const refreshUserAccessToken = async (refreshToken : string) => {
    
    //Verify refreshToken
    const {payload} = verifyToken<RefreshTokenPayload>(refreshToken, {secret : refreshTokenSignOptions.secret});
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token")

    //find session by payload sessionID, check to make sure that it exists and hasn't expired
    const session = await SessionModel.findById(payload.sessionID);
    const now = Date.now();
    appAssert(session && session?.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired");

    //refresh the session if expires in next 24h 
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;    
    
    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    //make new tokens
    const newRefreshToken = sessionNeedsRefresh ? signToken({sessionID : session._id}, refreshTokenSignOptions) : undefined
    const accessToken = signToken({userID : session.userID, sessionID : session._id, });

    return {accessToken, newRefreshToken};
}

export const verifyEmail = async (code : string) => {
    
    // Validate that the code is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(code)) {
        throw new Error('Invalid verification code format');
    }
    
    //get verification code
    const validCode = await VerificationCodeModel.findOne({
        _id : new mongoose.Types.ObjectId(code),
        type : VerificationCodeType.EmailVerification,
        expiresAt : {$gt : new Date()}
    })
    appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

    //find and update user 
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userID, {
        verified : true
    }, {new : true});

    appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify email');
    await validCode.deleteOne();

    return {user : updatedUser.omitPassword()}
}

export const sendPasswordResetEmail = async (email : string) => {
    //get user by email
    try {
        const user = await UserModel.findOne({email});
        appAssert(user, NOT_FOUND, 'User not found');
        
        //check email rate limit
        const fiveMinAgo = fiveMinutesAgo();
        const count = await VerificationCodeModel.countDocuments({
            userID : user._id,
            type : VerificationCodeType.PasswordReset,
            createdAt : {$gt : fiveMinAgo}
        })
        appAssert(count <= 1, TOO_MANY_REQUESTS, 'Too many requests, please try again later');
        //create verification code
        const expiresAt = oneHourFromNow();
        
        const verificationCode = await VerificationCodeModel.create({
            userID : user._id,
            type : VerificationCodeType.PasswordReset,
            expiresAt 
        })
        //send verification email
        const url = `${APP_ORIGIN}/password/reset/?code=${verificationCode._id}&exp=${expiresAt.getTime()}`
        const {data, error} = await sendMail({
            to: user.email,
            ...getPasswordResetTemplate(url)
        })
        appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`)
        //return success
        return {url, emailID : data.id}
    }
    catch (err : any) {
        console.log('SendPasswordResetError', err.message);
        return {};
    }
}

type resetPasswordParams = {
    password: string,
    verificationCode : string
}

export const resetPassword = async ({password, verificationCode} : resetPasswordParams) => {
    //get verification code
    //update password if valid
    //delete verification code
    //delete all sessions

    const code = await VerificationCodeModel.findOne({
        _id : verificationCode,
        type : VerificationCodeType.PasswordReset,
        expiresAt : {$gt : new Date()}
    });
    appAssert(code, NOT_FOUND, 'Invalid verification code');

    const updatedUser = await UserModel.findByIdAndUpdate(code.userID, {password : await hashValue(password)})
    
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to reset password');

    await code.deleteOne();

    await SessionModel.deleteMany({userID : updatedUser._id});

    return {user : updatedUser.omitPassword()}
}