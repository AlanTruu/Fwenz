import mongoose from 'mongoose'
import { thirtyDaysFromNow } from '../utils/Date';

export interface SessionDocument extends mongoose.Document {
    userID : mongoose.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userID: {
        ref : 'user',
        type : mongoose.Schema.Types.ObjectId,
        index : true
    },
    userAgent : String,
    createdAt : {type : Date, required : true, default : Date.now()},
    expiresAt : {type : Date, default : thirtyDaysFromNow}
})

const SessionModel = mongoose.model<SessionDocument>('session', sessionSchema);
export default SessionModel;