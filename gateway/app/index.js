import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import config from '../config'
import controller from './controller'

export default async function initApp() {
	console.log(JSON.stringify(config, null, 2))
	const app = express();
	const multerMiddleware = multer({ dest: '/temp/' })
	app.use(multerMiddleware.any())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use('*', await controller.proxy)
	app.disable('x-powered-by')
	const server = app.listen(config.port, function () {
		var port = server.address().port;
		console.log('Gateway is runing', port);
		return server;
	});
};
