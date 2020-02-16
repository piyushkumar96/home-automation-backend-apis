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
	Joi = require('joi');

// Internal Modules
const userSchema = require('../../models/users/usersModel'),
	RequestHandler = require('../../utils/RequestHandler'),
	Logger = require('../../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);


class UsersController {

	/**
	 * get User by Id
	 * @param {String} id
	 *
	 * @returns {Promise}
	 */
	static async getUserById(req, res) {
		try {
			const Id = req.params.id,
				schema = {
					id: Joi.string(),
				};

			const { error } = Joi.validate({ id: Id }, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', 'invalid User Id');

			const user = await userSchema.findOne({
				Id: Id
			});

			if (!user) {
				requestHandler.throwError(400, 'bad request', "invalid id or user doesn't existed")();
			}

			return requestHandler.sendSuccess(res, 'User Data Fetched Successfully')({ user });
		} catch (error) {
			return requestHandler.sendError(req, res, error);
		}
	}

	/**
	 * get user profile
	 *
	 * @returns {Promise}
	 */
	static async getProfile(req, res) {
		try {
			const userProfile = req.user
			
			return requestHandler.sendSuccess(res, 'User Profile fetched Successfully')({ userProfile });
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * update user's profile
	 *
	 * @returns {Promise}
	 */
	static async updateUserProfile(req, res) {

		const updates = Object.keys(req.body)
        const allowedUpdates = ["age"]
        const isvalidOperation = updates.every((updates) => allowedUpdates.includes(updates))

        if (!isvalidOperation) {
            requestHandler.throwError(400, 'bad request', "Invalid updates!!!");
        }

		try {
			updates.forEach((update) => req.user[update] = req.body[update])
			await req.user.save()
			
			return requestHandler.sendSuccess(res, 'User Profile updated Successfully')();
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * update user's password
	 * @param {String} oldPassword
 	 * @param {String} newPassword
	 * 
	 * @returns {Promise}
	 */
	static async updateUserPassword(req, res) {

		try {
			const isvalidOperation = bcrypt.compareSync(req.body.oldPassword, req.user.password)
            if (!isvalidOperation) {
                requestHandler.throwError(400, 'bad request', "Incorrect Old password!!!")()
            }

            req.user.password = req.body.newPassword
            await req.user.save()
			
			return requestHandler.sendSuccess(res, 'User Password updated Successfully')();
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * delete the user from db
	 *
	 * @returns {Promise}
	 */
	static async deleteUser(req, res) {
		try {
			await req.user.remove()

			return requestHandler.sendSuccess(res, `User ${req.user.name} Deleted Successfully`)();
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = UsersController;
