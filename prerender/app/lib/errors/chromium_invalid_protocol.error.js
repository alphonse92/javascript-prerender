export class ChromiumInvalidProtocol extends Error {
  constructor() {
    super('Invalid chromium protocol')
    this.status = 500
  }

}