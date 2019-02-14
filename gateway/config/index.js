import _ from 'lodash'

const confSchema = {
	config: {
		env: process.env.NODE_ENV || 'local',
	}
}

const confFromEnv = Object
	.keys(process.env)
	.reduce((out, key) => _.set(out, key.replace(new RegExp('_', 'g'), '.'), process.env[key]), {})
const env = confSchema.config.env
const confFromFileConf = require('./env/' + env.toLowerCase()).default
const mergedConf = _.merge(_.merge(confSchema, confFromFileConf), confFromEnv)

const { config } = mergedConf
config.blacklist = config.blacklist ? config.blacklist.split('|') : []
config.useragents.redirect = config.useragents.redirect ? config.useragents.redirect.split('|') : []
config.useragents.block = config.useragents.block ? config.useragents.block.split('|') : []
export default config
