import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userID: mongoose.Types.ObjectId;
      sessionID: mongoose.Types.ObjectId;
    }
  }
}
export {};