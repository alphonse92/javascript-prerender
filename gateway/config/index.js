import _ from 'lodash'

const confSchema = {
	config: {
		env: process.env.NODE_ENV || 'local',
		blacklist: '',
		ms: {}
	}
}

const confFromEnv = Object
	.keys(process.env)
	.reduce((out, key) => _.set(out, key.replace(new RegExp('_', 'g'), '.'), process.env[key]), {})
const env = confSchema.config.env
const confFromFileConf = require('./env/' + env.toLowerCase()).default
const conf = _.merge(_.merge(confSchema, confFromFileConf), confFromEnv)
export default conf.config
