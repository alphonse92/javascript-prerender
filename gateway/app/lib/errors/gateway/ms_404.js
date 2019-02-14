import { InternalError } from "./internal.error";
import { NOT_FOUND } from "../../constants/http.status";
import { MS_404 } from "../../constants/gateway";

export class MicroserviceDoesNotExist extends InternalError {
  constructor(name) {
    super()
    this.status = NOT_FOUND
    this.message = MS_404
    this.data = { name }
  }
}