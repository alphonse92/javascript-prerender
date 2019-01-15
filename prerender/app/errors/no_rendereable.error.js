export class NotAllowedToRender extends Error {
  constructor() {
    super('Not allowed to render')
    this.status = 500
  }

}