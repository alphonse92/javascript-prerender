import redis from 'redis'
import { promisify } from 'util'

let client

function createClient(conf) {
  const redisClient =
    redis.createClient(conf.port, conf.url, { 'return_buffers': true });
  const schema = {
    get: null,
    set: null,
  }
  const createSchema = (client, key) => Object.assign(client, { [key]: promisify(client[key].bind(client)) })
  return Object.keys(schema).reduce(createSchema, schema)
}
function getOrClientClient(conf) {
  if (!client) client = createClient(conf)
  return client
}
export const REDIS = getOrClientClient