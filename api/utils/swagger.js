/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains swagger confriguration
 **************************************************************************/

// to enable strict mode
'use strict';

//External modules
const express = require('express'),
	swaggerJSDoc = require('swagger-jsdoc'),
	swaggerUi = require('swagger-ui-express'),
	fs = require('fs'),
	path = require('path'),
	_ = require('lodash');

// Internal Modules	
const config = require('../../config/config.json');

const router = express.Router();

const directoryPath = path.join(__dirname, '../routes');
const pathes = [];

const filesName = fs.readdirSync(directoryPath, (err, files) => {
	// handling error
	if (err) {
		return console.log(`Unable to scan directory: ${err}`);
	}
	// listing all files using forEach
	return files.forEach(file => pathes.push(file));
});
function getFullPathes(names) {
	names.forEach((name) => {
		let customePath;
		if (name !== 'index') {
			customePath = `./routes/${name}`;
		}
		if (!(_.isUndefined(name))) {
			pathes.push(customePath);
		}
	});
}

getFullPathes(filesName);

const options = {
	swaggerDefinition: {
		info: {
			title: 'Home Automation,',
			version: '1.0.0',
			description: 'Home Automation, REST API with Swagger doc',
			contact: {
				email: 'piyush25032@gmail.com',
			},
		},
		tags: [
			{
				name: 'users',
				description: 'Users API',
			},
			{
				name: 'Auth',
				description: 'Authentication apis',
			},
			{
				name: 'Email',
				description: 'for testing and sending emails ',
			},
			{
				name: 'termsAndCondition',
				description: ' the terms and condition for the application',

			},
			{
				name: 'Versioning',
				description: ' operation related to check the version of the apis or the mobile .. etc ',

			},
		],
		schemes: ['http'],
		host: `localhost:${config.port}`,
		basePath: '/api/v1',
		securityDefinitions: {
			Bearer: {
				type: 'apiKey',
				description: 'JWT authorization of an API',
				name: 'Authorization',
				in: 'header',
			},
		},
	},

	apis: pathes,
};
const swaggerSpec = swaggerJSDoc(options);
require('swagger-model-validator')(swaggerSpec);

router.get('/json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function validateModel(name, model) {
	const responseValidation = swaggerSpec.validateModel(name, model, false, true);
	if (!responseValidation.valid) {
		throw new Error('Model doesn\'t match Swagger contract');
	}
}

module.exports = {
	router,
	validateModel,
};
