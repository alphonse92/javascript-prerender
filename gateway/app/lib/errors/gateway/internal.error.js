import { INTERNAL_ERROR } from '../../constants/gateway'
export class InternalError extends Error {
  constructor() {
    super(INTERNAL_ERROR)
    this.status = 500
  }
}