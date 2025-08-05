import assert from 'node:assert'
import AppError from './AppError'
import { HttpStatusCode } from '../constants/http'
import AppErrorCode from '../constants/appErrorCode'

type AppAssert = (
    condition : any,
    HttpStatusCode : HttpStatusCode,
    message : string,
    appErrorCode ?: AppErrorCode
) => asserts condition;

//Asserts a condition and throws an app error if condition is falsy
const appAssert : AppAssert = (
    condition,
    HttpStatusCode,
    message,
    appErrorCode

) => assert(condition, new AppError(HttpStatusCode, message, appErrorCode))

export default appAssert