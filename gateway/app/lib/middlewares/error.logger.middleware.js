import { Logger } from "@alphonse92/ms-lib"
import { UNEXPECTED_ERROR } from "../constants/common/common.errors";
import { SERVER_ERROR } from "../constants/http.status";


export const ErrorLoggerMiddleware = (err, req, res, next) => {
  const status = err.status || SERVER_ERROR
  const message = err.message || UNEXPECTED_ERROR
  const data = err.data || null
  const obj2log = { status, message, data }
  Logger.error(message)
  res.status(status).send(message);
}
