import _ from 'lodash'
import { Config } from '@alphonse92/ms-lib'
const env = process.env.NODE_ENV
const fileConfig = require('./env/' + env.toLowerCase()).default
const schema = { config: { env: env || 'local', } }
const mergedConf = Config.create(schema, process.env, fileConfig)
const { config } = mergedConf
config.blacklist = config.blacklist ? config.blacklist.split('|') : []
config.useragents.redirect = config.useragents.redirect ? config.useragents.redirect.split('|') : []
config.useragents.block = config.useragents.block ? config.useragents.block.split('|') : []

export default config
