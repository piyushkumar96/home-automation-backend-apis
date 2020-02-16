/*************************************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains function to add bulb and its handle features like power, color brightness
 *************************************************************************************************/

'use strict';

//External Modules 
const Joi = require('joi'),
	mongoose = require('mongoose');

// Internal Modules
const userSchema = require('../../models/users/usersModel'),
	devLogsSchema = require('../../models/devices/deviceLogsModel'),
	RequestHandler = require('../../utils/RequestHandler'),
	devLogsUpdate = require('../../utils/devLogsUpdate'),
	Logger = require('../../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);


class BulbsController {

	/**
	 * add bulb into the network
	 * @param {String} devName
	 * @param {String} manufacturer
	 * @param {String} model
	 * @param {String} serialNumber
	 * @param {JSON} houseDetails
	 *
	 * @returns {Promise}
	 */
	static async addBulb(req, res) {
		try {
			const data = req.body;
			const schema = {
				devName: Joi.string().required(),
				manufacturer: Joi.string().required(),
				model: Joi.string().required(),
				serialNumber: Joi.string().required(),
				houseDetails: Joi.required()
			};

			const { error } = Joi.validate({ devName: data.devName, manufacturer: data.manufacturer, model: data.model, serialNumber: data.serialNumber, houseDetails: data.houseDetails }, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');

			const deviceFeatures = {}
			deviceFeatures.status = "off"
			deviceFeatures.brightness = 0
			deviceFeatures.color = "white"
			deviceFeatures.condition = "working"

			data.deviceFeatures = deviceFeatures
			data.lastUsed = new Date();
			data.inNetwork = true
			data.devType = "bulb"
			data._id = new mongoose.Types.ObjectId()

			const count = req.user.devCounts.bulb + 1
			data.devId = "BULB" + count

			const devLogs = new devLogsSchema({
				userId: req.user.Id,
				devId: "BULB" + count,
				devName: data.devName,
				devType: "bulb",
				logs: [
					`This device is added to the network for the first time at [${new Date()}].`
				]
			})

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const devAddition = await userSchema.findOneAndUpdate(
				{
					"Id": req.user.Id
				},
				{
					$push: { "devices": data },
					$inc: { "devCounts.bulb": 1 }
				},
				{
					upsert: false,
					new: true
				});

			if (!devAddition) {
				requestHandler.throwError(500, " Error in adding a bulb into the network. Please try again!!!")
			}

			const devLogsUpdate = await devLogs.save();

			if (!devAddition) {
				requestHandler.throwError(500, " Error in occured while add logs of device!!!!")
			}

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `Device ${data.devName} is added Successfully into the network`)();

		} catch (error) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();
			return requestHandler.sendError(req, res, error);
		}
	}

	/**
	 * controling power on or off
	 * @param {String} devId
	 * @param {String} status
	 *
	 * @returns {Promise}
	 */
	static async powerOnOff(req, res) {
		try {
			const devId = req.body.devId,
				status = req.body.status,
				userId = req.user.Id;

			const log = `The bulb is powered ${status} at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const power = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].deviceFeatures.status": status,
						"devices.$[elem].lastUsed": new Date()
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: false
				});

			if (!power) {
				requestHandler.throwError(500, `Error Powering ${status} bulb with id ${devId}. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `Bulb with id ${devId} is successfully power ${status} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * changing color of bulb
	 * @param {String} devId
	 * @param {String} color
	 *
	 * @returns {Promise}
	 */
	static async changeColor(req, res) {
		try {
			const devId = req.body.devId,
				color = req.body.color,
				userId = req.user.Id;

			const log = `The color of bulb is changed to ${color} at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const colorUpdate = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].deviceFeatures.color": color,
						"devices.$[elem].lastUsed": new Date()
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: true
				});

			if (!colorUpdate) {
				requestHandler.throwError(500, `Error Changing color ${status} of bulb with id ${devId}. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `The color of bulb with id ${devId} is successfully changed to ${color} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * increase or decrease brightness of bulb
	 * @param {String} devId
	 * @param {String} state
	 *
	 * @returns {Promise}
	 */
	static async setBrightness(req, res) {
		try {
			const devId = req.body.devId,
				brightness = req.body.brightness,
				userId = req.user.Id;

			const log = `The brightness of bulb is set to ${brightness} at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const brtUpdate = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].deviceFeatures.brightness": brightness,
						"devices.$[elem].lastUsed": new Date()
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: true
				});

			if (!brtUpdate) {
				requestHandler.throwError(500, `Error in setting the brightness of the bulb with id ${devId} to ${brightness}. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `The brightness of the bulb with id ${devId} is successfully set to ${brightness} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();
			return requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = BulbsController;
