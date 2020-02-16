/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains functions for making logs for different modes of log
 **************************************************************************/

// to enable strict mode
'use strict';

//External modules
const { createLogger, format, transports } = require('winston'),
	fs = require('fs'),
	DailyRotate = require('winston-daily-rotate-file');

// Internal Modules	
const config = require('../../config/config.json');

require('dotenv').config();

const { env } = process.env.NODE_ENV || config.node_env,
	logDir = 'log';

let infoLogger,
	errorLogger,
	warnLogger,
	allLogger;


class Logger {
	constructor() {
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}

		infoLogger = createLogger({
			// change level if in dev environment versus production
			level: env === 'dev' ? 'info' : 'debug',
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
				// this is to log in json format
				// format.json()

			),
			transports: [
				new transports.Console({
					levels: 'info',
					format: format.combine(
						format.colorize(),
						format.printf(
							info => `${info.timestamp} ${info.level}: ${info.message}`,
						),
					),
				}),

				new (DailyRotate)({
					filename: `${logDir}/%DATE%-info-results.log`,
					datePattern: 'YYYY-MM-DD',
				}),
			],
			exitOnError: false,
		});

		errorLogger = createLogger({
			// change level if in dev environment versus production
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.printf(error => `${error.timestamp} ${error.level}: ${error.message}`),

			),
			transports: [
				new transports.Console({
					levels: 'error',
					format: format.combine(
						format.colorize(),
						format.printf(
							error => `${error.timestamp} ${error.level}: ${error.message}`,
						),
					),
				}),

				new (DailyRotate)({
					filename: `${logDir}/%DATE%-errors-results.log`,
					datePattern: 'YYYY-MM-DD',
				}),
			],
			exitOnError: false,
		});

		warnLogger = createLogger({
			// change level if in dev environment versus production
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.printf(warn => `${warn.timestamp} ${warn.level}: ${warn.message}`),

			),
			transports: [
				new transports.Console({
					levels: 'warn',
					format: format.combine(
						format.colorize(),
						format.printf(
							warn => `${warn.timestamp} ${warn.level}: ${warn.message}`,
						),
					),
				}),

				new (DailyRotate)({
					filename: `${logDir}/%DATE%-warnings-results.log`,
					datePattern: 'YYYY-MM-DD',
				}),
			],
			exitOnError: false,
		});

		allLogger = createLogger({
			// change level if in dev environment versus production
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.printf(silly => `${silly.timestamp} ${silly.level}: ${silly.message}`),

			),
			transports: [
				new (DailyRotate)({
					filename: `${logDir}/%DATE%-results.log`,
					datePattern: 'YYYY-MM-DD',
				}),
			],
			exitOnError: false,
		});
	}

	log(message, severity, data) {
		if (severity == null || infoLogger.levels[severity] == null) {
			this.severity = 'info';
		}
		if (severity === 'info') {
			infoLogger.log(severity, message, data);
			allLogger.log(severity, message, data);
		} else if (severity === 'error') {
			errorLogger.log(severity, message);
			allLogger.log(severity, message, data);
		} else if (severity === 'warn') {
			warnLogger.log(severity, message, data);
			allLogger.log(severity, message, data);
		}
	}
}

module.exports = Logger;
