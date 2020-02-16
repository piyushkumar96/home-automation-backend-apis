/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains functions for updating features of device
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
	async updateDevFeature(userId, devId, feature, value, errorComment) {
		//let queryString = `{ "devices.$[elem].deviceFeatures.${feature}": "${color}", "devices.$[elem].lastUsed": ${new Date()} }`
		devLogsSchema.findOneAndUpdate(
			{
				"Id": userId
			},
			{
				// $set: JSON.parse(`{{ "devices.$[elem].deviceFeatures.${feature}": "${color}", "devices.$[elem].lastUsed": ${new Date()} }`
				$set: {
					"devices.$[elem].deviceFeatures.${feature}": color,
					"devices.$[elem].lastUsed": new Date()
				}
			},
			{
				arrayFilters: [{ "elem.devId": devId }],
				upsert: false,
				new: true
			},
			function (err, doc) {

				if (err) {
					requestHandler.throwError(500, `Error Changing color ${status} of bulb with id ${devId}. Please try again!!!`)
				}
			})
	},
};
