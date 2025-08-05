import { RequestHandler } from "express"
import { UserModel } from "../models/user.model"
import { NOT_FOUND } from "../constants/http";
import { OK } from "../constants/http";
import appAssert from "../utils/appAssert";

export const getUserHandler : RequestHandler = async (req , res) => {
    const user = await UserModel.findById(req.userID);
    appAssert(user, NOT_FOUND, 'User not found');
    return void res.status(OK).json(user.omitPassword());
}