import { RequestHandler } from "express";
import SessionModel from "../models/session.model";
import { NOT_FOUND, OK } from "../constants/http";
import {z} from 'zod'
import appAssert from "../utils/appAssert";

export const getSessionsHandler : RequestHandler = async (req, res) => {
    const sessions = await SessionModel.find({
        userID : req.userID,
        expiresAt : {$gt : new Date()}
    }, {_id : 1, userAgent : 1, createdAt : 1}, {sort : {createdAt : -1}})

    return void res.status(OK).json(
        sessions.map((session) => ({
            ...session.toObject(),
            ...(session.id === req.sessionID && {isCurrent : true})
        }))
    )
}

export const deleteSessionHandler : RequestHandler = async (req, res) => {
    const sessionID = z.string().parse(req.params.id);

    const deleted = await SessionModel.findOneAndDelete({
        _id : sessionID,
        userID : req.userID
    })

    appAssert(deleted, NOT_FOUND, 'Session not found');

    return void res.status(OK).json({message : 'Session deleted'});
}

export const deleteAllSessionsHandler : RequestHandler = async (req, res) => {
    await SessionModel.deleteMany({userID : req.userID})
    return void res.status(OK).json({message : 'All Sessions deleted'})
}