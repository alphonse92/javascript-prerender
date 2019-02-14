import { InternalError } from "./internal.error";
import { UNAUTHORIZED } from "../../constants/http.status";
import { MS_401 } from "../../constants/gateway";

export class MicroserviceNotAllowed extends InternalError {
  constructor(name) {
    super()
    this.status = UNAUTHORIZED
    this.message = MS_401
    this.data = { name }
  }
}