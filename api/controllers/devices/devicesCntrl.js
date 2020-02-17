/*************************************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains function to control the devices like power on/off, remove dev from network etc.
 *************************************************************************************************/

// to enable strict mode
'use strict';

//External Modules 
const mongoose = require('mongoose');

// Internal Modules
const userSchema = require('../../models/users/usersModel'),
	devLogsSchema = require('../../models/devices/deviceLogsModel'),
	RequestHandler = require('../../utils/RequestHandler'),
	devLogsUpdate = require('../../utils/devLogsUpdate'),
	Logger = require('../../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);


class DevicesController {

	/**
	 * controling power on or off
	 * @param {String} devId
	 * @param {String} devType
	 * @param {String} status
	 *
	 * @returns {Promise}
	 */
	static async powerOnOff(req, res) {
		try {
			const devId = req.body.devId,
				devType = req.body.devType,
				status = req.body.status,
				userId = req.user.Id;

			const log = `The ${devType} is powered ${status} at [${new Date()}].`

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

			return requestHandler.sendSuccess(res, `${devType} with id ${devId} is successfully power ${status} @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();

			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * remove the device from network
	 * @param {String} devId
	 * @param {String} devType
	 *
	 * @returns {Promise}
	 */
	static async removeDevice(req, res) {
		try {
			const devId = req.body.devId,
				devType = req.body.devType,
				userId = req.user.Id;

			const log = `The ${devType} with id ${devId} is removed from network at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const remDev = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].inNetwork": false
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: true
				});

			if (!remDev) {
				requestHandler.throwError(500, `Error removing the device ${devType} with id ${devId} from network. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `The device ${devType} with id ${devId} is successfully removed from network  @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();

			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * adding back the device to the network which were removed earlier
	 * @param {String} devId
	 * @param {String} devType
	 *
	 * @returns {Promise}
	 */
	static async addDeviceToNwk(req, res) {
		try {
			const devId = req.body.devId,
				devType = req.body.devType,
				userId = req.user.Id;

			const log = `The ${devType} with id ${devId} is added back into the network at [${new Date()}].`

			//Start mongodb transaction session 
			const session = await mongoose.startSession();
			session.startTransaction();


			const remDev = await userSchema.findOneAndUpdate(
				{
					"Id": userId
				},
				{
					$set: {
						"devices.$[elem].inNetwork": true
					}
				},
				{
					arrayFilters: [{ "elem.devId": devId }],
					upsert: false,
					new: true
				});

			if (!remDev) {
				requestHandler.throwError(500, `Error in adding back the device ${devType} with id ${devId} into the network. Please try again!!!`)
			}

			await devLogsUpdate.updateDevLogs(userId, devId, log)

			//Commit the transaction when all the database operations performed successfully.
			await session.commitTransaction();
			session.endSession();

			return requestHandler.sendSuccess(res, `The device ${devType} with id ${devId} is successfully added back into the network  @@@`)();
		} catch (err) {
			//Rollback database state changes.
			await session.abortTransaction();
			session.endSession();

			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * get the device by Id
	 * @param {String} devId
	 * 
	 * @returns {Promise}
	 */
	static async getDeviceById(req, res) {
		try {
			const devId = req.params.devId,
				userId = req.user.Id;

			const device = await userSchema.aggregate([
				{
					$unwind: "$devices"
				},
				{
					$match: {
						"devices.devId": devId,
						"Id": userId
					}
				},
				{
					$group: {
						_id: '$_id',
						devices: { $push: '$devices' }
					}
				},
				{
					$project: {
						_id: 0,
						devices: 1
					}
				}
			]);

			if (device.length == 0) {
				return requestHandler.sendSuccess(res, `No device found with id ${devId}.`)();
			}

			return requestHandler.sendSuccess(res, `Details of device with ${devId} @@@`)(device[0].devices);
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * get all devices of same device type
	 * @param {String} devType
	 * 
	 * @returns {Promise}
	 */
	static async getAllDevsSameType(req, res) {
		try {
			const devType = req.params.devType,
				userId = req.user.Id;

			const devices = await userSchema.aggregate([
				{
					$unwind: "$devices"
				},
				{
					$match: {
						"devices.devType": devType,
						"Id": userId
					}
				},
				{
					$group: {
						_id: '$_id',
						devices: { $push: '$devices' }
					}
				},
				{
					$project: {
						_id: 0,
						devices: 1
					}
				}
			]);

			if (devices.length == 0) {
				return requestHandler.sendSuccess(res, `No devices found with this type ${devType}.`)();
			}

			return requestHandler.sendSuccess(res, `Devices with type ${devType} @@@`)(devices[0].devices);
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * get all devices of all room
	 * @param {String} roomNum
	 * 
	 * @returns {Promise}
	 */
	static async getAllDevsInRoom(req, res) {
		try {
			const roomNum = Number(req.params.roomNum),
				userId = req.user.Id;

			const devices = await userSchema.aggregate([
				{
					$unwind: "$devices"
				},
				{
					$match: {
						"devices.houseDetails.roomNum": roomNum,
						"Id": userId
					}
				},
				{
					$group: {
						_id: '$_id',
						devices: { $push: '$devices' }
					}
				},
				{
					$project: {
						_id: 0,
						devices: 1
					}
				}
			]);

			if (devices.length == 0) {
				return requestHandler.sendSuccess(res, `No devices found in room number ${roomNum}.`)();
			}

			return requestHandler.sendSuccess(res, `Devices in room number ${roomNum} @@@`)(devices[0].devices);
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * get all devices of at single floor
	 * @param {String} floor
	 * 
	 * @returns {Promise}
	 */
	static async getAllDevsAtFloor(req, res) {
		try {
			const floor = Number(req.params.floor),
				userId = req.user.Id;

			const devices = await userSchema.aggregate([
				{
					$unwind: "$devices"
				},
				{
					$match: {
						"devices.houseDetails.floor": floor,
						"Id": userId
					}
				},
				{
					$group: {
						_id: '$_id',
						devices: { $push: '$devices' }
					}
				},
				{
					$project: {
						_id: 0,
						devices: 1
					}
				}
			]);

			if (devices.length == 0) {
				return requestHandler.sendSuccess(res, `No devices found at ${floor} floor .`)();
			}

			return requestHandler.sendSuccess(res, `Devices at ${floor} floor @@@`)(devices[0].devices);
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}

	/**
	 * get logs of device
	 * @param {String} devId
	 * 
	 * @returns {Promise}
	 */
	static async getDeviceLogs(req, res) {
		try {
			const devId = req.params.devId,
				userId = req.user.Id;

			const devLogs = await devLogsSchema.findOne(
				{
					"userId": userId,
					"devId": devId

				},
				{

					_id: 0,
					logs: 1
				}

			);

			if (devLogs.logs.length == 0) {
				return requestHandler.sendSuccess(res, `No logs found for device with Id ${devId}.`)();
			}

			return requestHandler.sendSuccess(res, `Logs of device with Id ${devId} @@@`)(devLogs);
		} catch (err) {
			return requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = DevicesController;
