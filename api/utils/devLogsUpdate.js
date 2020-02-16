/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains functions for updating logs of device
 **************************************************************************/

// to enable strict mode
'use strict';

// Internal Modules
const devLogsSchema = require('../models/devices/deviceLogsModel'),
	RequestHandler = require('./RequestHandler'),
	Logger = require('./logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

module.exports = {
	/**
	 * updating the logs of device
	 * @param {String} userId
	 * @param {String} devId
	 * @param {String} log
	 *
	 * @returns {Promise}
	 */
	async updateDevLogs(userId, devId, log) {

		const logsUpd = await devLogsSchema.findOneAndUpdate(
			{
				"userId": userId,
				"devId": devId
			},
			{
				$push: {
					logs: log
				}
			},
			{
				upsert: false,
				new: true
			});

		if (!logsUpd) {
			requestHandler.throwError(500, `Error in updating the logs!!!`)
		}
	},
};
