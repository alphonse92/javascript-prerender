import { INTERNAL_ERROR, GATEWAY_ERROR } from '../../constants/gateway'
export class GatewayError extends Error {
  constructor(data) {
    super(GATEWAY_ERROR)
    this.status = 502
    this.data = data
  }
}
