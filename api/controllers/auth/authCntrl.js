/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains user's login, signup, logout main logic
 **************************************************************************/

'use strict';

//External Modules 
const bcrypt = require('bcryptjs'),
	uuidv4 = require('uuid/v4'),
	Joi = require('joi');

// Internal Modules
const userSchema = require('../../models/users/usersModel'),
	RequestHandler = require('../../utils/RequestHandler'),
	Logger = require('../../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);


class AuthController {

	/**
	 * Login User
	 * @param {String} email
	 * @param {String} password
	 *
	 * @returns {Promise}
	 */
	static async login(req, res) {

		let email = req.body.email,
			password = req.body.password;

		try {
			const schema = {
				email: Joi.string().email().required(),
				password: Joi.string().required()
			};
			const { error } = Joi.validate({
				email: email,
				password: password
			}, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');

			// checking that user is exists in database or not
			const user = await userSchema.findByCrendentials(email)
			if (!user) {
				requestHandler.throwError(400, 'bad request', 'invalid email address')();
			}

			// verifying the password
			await bcrypt
				.compare(password, user.password)
				.then(
					requestHandler.throwIf(r => !r, 400, 'incorrect', 'failed to login bad credentials'),
					requestHandler.throwError(500, 'bcrypt error'),
				);

			// generating Jwt token for user
			const token = await user.generateAuthToken()

			requestHandler.sendSuccess(res, 'User logged in Successfully')({
				user: user,
				token: token
			});
		} catch (error) {
			requestHandler.sendError(req, res, error);
		}
	}

	/**
	 * Create User
	 * @param {String} name
	 * @param {String} email
	 * @param {String} password
	 *
	 * @returns {Promise}
	 */
	static async signUp(req, res) {
		try {
			const data = req.body;
			const schema = {
				email: Joi.string().email().required(),
				name: Joi.string().required(),
				password: Joi.string().required()
			};

			const { error } = Joi.validate({ email: data.email, name: data.name, password: data.password }, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');


			// checking that user is exists in database or not
			const userCheck = await userSchema.findByCrendentials(data.email)
			if (userCheck) {
				requestHandler.throwError(400, 'bad request', 'invalid email account,email already existed')();
			}

			data.Id = uuidv4()
			data.devCounts = {
				"bulb": 0,
				"fan": 0,
				"ac": 0
			}
			const user = new userSchema(data)

			await user.save()
			const token = await user.generateAuthToken()

			// async.parallel([
			// 	function one(callback) {
			// 		emailUtil.sendEmail(
			// 			callback,
			// 			config.sendgrid.senderEmailID,
			// 			[data.email],
			// 			' Home Automation ',
			// 			`please consider the following as welcome mail`,
			// 			`<p style="font-size: 32px;">Hello ${data.name}</p>  please consider the following as welcome mail`,
			// 		);
			// 	},
			// ], (err, results) => {
			// 	if (err) {
			// 		requestHandler.throwError(500, 'internal Server Error', 'failed to send welcome email')();
			// 	} else {
			// 		logger.log(`an email has been sent at: ${new Date()} to : ${data.email} with the following results ${results}`, 'info');
			// 	}
			// });

			requestHandler.sendSuccess(res, 'email with your password sent successfully', 201)({
				user: user,
				token: token
			});

		} catch (err) {
			requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * Logout User's Current Sessions
	 *
	 * @returns {Promise}
	 */
	static async logoutCS(req, res) {
		try {

			req.user.tokens = req.user.tokens.filter((token) => {
				return token.token !== req.token
			})
			await req.user.save()

			requestHandler.sendSuccess(res, 'User Current Session Logged Out Successfully')();

		} catch (err) {
			requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * Logout User's All Sessions
	 *
	 * @returns {Promise}
	 */
	static async logoutAS(req, res) {
		try {

			req.user.tokens = []
			await req.user.save()

			requestHandler.sendSuccess(res, 'User All Sessions Logged Out Successfully')();

		} catch (err) {
			requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = AuthController;
