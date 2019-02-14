import { Logger } from "../../utils";
import { UNEXPECTED_ERROR } from "../constants/common/common.errors";
import { SUCCESSFULL } from "../constants/http.status";


export const ErrorLoggerMiddleware = (err, req, res, next) => {
  const status = err.status || SUCCESSFULL
  const message = err.message || UNEXPECTED_ERROR
  const data = err.data || null
  const obj2log = { status, message, data }
  Logger.error(message)
  res.status(status).json(message);
}
