
import * as systems from './systems/redis'
import { CacheSystemDoesNotExist } from '../errors'

export const types = Object.keys(systems)
export const Factory = {
   get(type, config) {
    if (!systems[type]) throw new CacheSystemDoesNotExist()
    return  systems[type](config)
  }
}
