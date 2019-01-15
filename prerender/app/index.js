import express from 'express'
import config from '../config'
import middleware_builder_fn from './prerender'

export default async function initApp() {
	const app = express();
	const prerender_middleware = await middleware_builder_fn()
	app.use("*", prerender_middleware)
	app.disable('x-powered-by')
	const server = app.listen(config.port, function () {
		var port = server.address().port;
		console.log('Server is running on port:', port);
		return server; 
	});
};
