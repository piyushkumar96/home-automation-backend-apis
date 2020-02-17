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


class AcsController {

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
	static async addAC(req, res) {
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
			deviceFeatures.temperature = 25
			deviceFeatures.condition = "working"

			data.deviceFeatures = deviceFeatures
			data.lastUsed = new Date();
			data.inNetwork = true
			data.devType = "ac"
			data._id = new mongoose.Types.ObjectId()

			const count = req.user.devCounts.ac + 1
			data.devId = "AC" + count

			const devLogs = new devLogsSchema({
				userId: req.user.Id,
				devId: "AC" + count,
				devName: data.devName,
				devType: "ac",
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
					$inc: { "devCounts.ac": 1 }
				},
				{
					upsert: false,
					new: true
				});

			if (!devAddition) {
				requestHandler.throwError(500, " Error in adding an AC into the network. Please try again!!!")
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
	 * controling power on or off
	 * @param {String} devId
	 * @param {String} status
	 *
	 * @returns {Promise}
	 */
	static async powerOnOffAC(req, res) {
		try {
			const devId = req.body.devId,
				status = req.body.status,
				userId = req.user.Id;

			const log = `The Ac is powered ${status} at [${new Date()}].`

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
				requestHandler.throwError(500, `Error Powering ${status} AC with id ${devId}. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `AC with id ${devId} is successfully power ${status} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();

			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * increase or decrease temperature of AC
	 * @param {String} devId
	 * @param {String} temp
	 *
	 * @returns {Promise}
	 */
	static async setACTemperature(req, res) {
		try {
			const devId = req.body.devId,
				temp = req.body.temp,
				userId = req.user.Id;

			const log = `The Temperature of AC is set to ${temp} at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const speedUpdate = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].deviceFeatures.temp": temp,
						"devices.$[elem].lastUsed": new Date()
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: true
				});

			if (!speedUpdate) {
				requestHandler.throwError(500, `Error in setting the temperature of the AC with id ${devId} to ${temp}. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `The temperature of the AC with id ${devId} is successfully set to ${temp} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();

			return requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = AcsController;
