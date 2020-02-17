/*************************************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains function to add bulb and its handle features like power, color brightness
 *************************************************************************************************/

// to enable strict mode
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


class FansController {

	/**
	 * add fan into the network
	 * @param {String} devName
	 * @param {String} manufacturer
	 * @param {String} model
	 * @param {String} serialNumber
	 * @param {JSON} houseDetails
	 *
	 * @returns {Promise}
	 */
	static async addFan(req, res) {
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
			deviceFeatures.speed = 0
			deviceFeatures.condition = "working"

			data.deviceFeatures = deviceFeatures
			data.lastUsed = new Date();
			data.inNetwork = true
			data.devType = "fan"
			data._id = new mongoose.Types.ObjectId()

			const count = req.user.devCounts.fan + 1
			data.devId = "FAN" + count

			const devLogs = new devLogsSchema({
				userId: req.user.Id,
				devId: "FAN" + count,
				devName: data.devName,
				devType: "fan",
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
					$inc: { "devCounts.fan": 1 }
				},
				{
					upsert: false,
					new: true
				});

			if (!devAddition) {
				requestHandler.throwError(500, " Error in adding a fan into the network. Please try again!!!")
			}

			const devLogsUpdate = await devLogs.save();

			if (!devLogsUpdate) {
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
	 * increase or decrease speed of fan
	 * @param {String} devId
	 * @param {String} speed
	 *
	 * @returns {Promise}
	 */
	static async setFanSpeed(req, res) {
		try {
			const devId = req.body.devId,
				speed = req.body.speed,
				userId = req.user.Id;

			const log = `The Speed of bulb is set to ${speed} at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const speedUpdate = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].deviceFeatures.speed": speed,
						"devices.$[elem].lastUsed": new Date()
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: true
				});

			if (!speedUpdate) {
				requestHandler.throwError(500, `Error in setting the speed of the fan with id ${devId} to ${speed}. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `The speed of the bulb with id ${devId} is successfully set to ${speed} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();

			return requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = FansController;
