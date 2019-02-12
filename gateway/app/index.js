import express from 'express'
import bodyParser from 'body-parser'

import config from '../config'
import controller from './controller'

export default async function initApp() {
	const app = express();
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use("/health", controller.health)
	app.use("/", controller.health)
	app.use('*', controller.proxy)
	app.disable('x-powered-by')
	const server = app.listen(config.port, function () {
		var port = server.address().port;
		console.log('Gateway is runing', port);
		return server;
	});
};
