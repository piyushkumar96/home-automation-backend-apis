/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file is for authenticating user to hit APIs
 **************************************************************************/

// to enable strict mode
'use strict';

//External Modules 
const jwt = require('jsonwebtoken'),
	_ = require('lodash');

// Internal Modules	
const config = require('../../config/config.json'),
	userSchema = require('../models/users/usersModel'),
	RequestHandler = require('../utils/RequestHandler'),
	Logger = require('../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

/**
 * Function to extract token from header
 * @param {json} req
 *
 * @returns {json}
 */
function getTokenFromHeader(req) {
	if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
		|| (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) {
		return req.headers.authorization.split(' ')[1];
	}

	return null;
}

/**
 * Function to verify token for authorization
 * @param {json} req
 * @param {json} res
 * @param {json} next
 *
 * @returns {json}
 */
function verifyToken(req, res, next) {
	try {
		if (_.isUndefined(req.headers.authorization)) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}
		const Bearer = req.headers.authorization.split(' ')[0];

		if (!Bearer || Bearer !== 'Bearer') {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		// verifies secret and checks exp
		jwt.verify(token, config.auth.jwt_secret, async (err, decoded) => {
			if (err) {
				requestHandler.throwError(401, 'Unauthorized', 'please provide a vaid token ,your token might be expired')();
			}

			const user = await userSchema.findOne({ _id: decoded._id, 'tokens.token': token })
			if (!user) {
				requestHandler.throwError(401, 'Unauthorized', 'user not found!')("user not found");
			}

			req.token = token
			req.user = user;

			next();
		});
	} catch (err) {
		requestHandler.sendError(req, res, err);
	}
}


module.exports = {
	getJwtToken: getTokenFromHeader,
	isAuthunticated: verifyToken
};
