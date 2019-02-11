export class CacheSystemDoesNotExist extends Error {
  constructor() {
    super('Cache System does not exist')
    this.status = 500
  }

}