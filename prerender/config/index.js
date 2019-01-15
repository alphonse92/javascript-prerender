import _ from 'lodash'

function getRemote(uri) {
	let type = typeof uri;
	if (!uri || (type !== 'string' && type !== 'object'))
		return null;
	else if (type === 'string') {

		let parts = uri.split('/').filter(val => !!val);
		let protocol = parts[0].replace(':', '');
		let domainParts = parts[1].split(':');
		let domain = domainParts[0];
		let port = domainParts[1];
		return { protocol, domain, port };
	} else {
		return uri;
	}
}

function removing_trailing_slashes(path) {
	while (path.endsWith('/')) path = path.slice(0, -1)
	return path
}

function clean(config) {
	[
		'target',
		'domain',
		'hostname',
		'cache_path',
		'chromium'
	].forEach(key => config[key] = removing_trailing_slashes(config[key]))
}

const base_conf = {
	env: 'no-env-setted',
	target: 'http://www.the-web-that-i-want-to-prerender.com',
	domain: 'www.miwebsite.com',
	hostname: 'localhost',
	port: 3000,
	debug: true,
	cache: 604800000, // a week
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
	cache_path: './tmp/prerender/',
	chromium: 'http://localhost:9222',
	header_target: 'x-prerender-target'
}

const base_headers = {}

const puppetter_opt = {
	headless: true // false if u want to use ur fisic chromium application
}

const filter = (target) => target.indexOf('sockjs-node') < 0
const env = process.env.NODE_ENV || 'local'
const env_config = require('./env/' + env).default
const prerender_configuration_keys = Object.keys(base_conf)
const prerender_conf_from_env_vars = _.pick(process.env, prerender_configuration_keys)
const defaultConfig = _.merge(_.merge(base_conf, env_config), prerender_conf_from_env_vars)

defaultConfig.remote = getRemote(defaultConfig.chromium)
defaultConfig.puppetter_opt = puppetter_opt
defaultConfig.filter = filter
defaultConfig.base_headers = base_headers

clean(defaultConfig)
export default defaultConfig
