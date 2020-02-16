/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains helper function to send mails
 **************************************************************************/

// to enable strict mode
'use strict';

//External Modules 
const helper = require('sendgrid').mail,
	async = require('async'),
	sg = require('sendgrid')(config.sendgrid.api_key);

// Internal Modules	
const config = require('../../config/config.json'),
	Logger = require('../utils/logger');

const logger = new Logger();

module.exports = {

	sendEmail(
		parentCallback,
		fromEmail,
		toEmails,
		subject,
		textContent,
		htmlContent,
	) {
		const errorEmails = [];
		const successfulEmails = [];
		async.parallel([
			function one(callback) {
				// Add to emails
				for (let i = 0; i < toEmails.length; i += 1) {
					// Add from emails
					const senderEmail = new helper.Email(fromEmail);
					// Add to email
					const toEmail = new helper.Email(toEmails[i]);
					// HTML Content
					const content = new helper.Content('text/html', htmlContent);
					const mail = new helper.Mail(senderEmail, subject, toEmail, content);
					const request = sg.emptyRequest({
						method: 'POST',
						path: '/v3/mail/send',
						body: mail.toJSON(),
					});
					sg.API(request, (error, response) => {
						if (error) {
							logger.log(`error ,Error during processing request at : ${new Date()} details message: ${error.message}`, 'error');
						}
						console.log(response.statusCode);
						console.log(response.body);
						console.log(response.headers);
					});
				}
				// return
				callback(null, true);
			},
		], (err, results) => {
			if (err) {
				logger.log(`error ,Error during processing request at : ${new Date()} details message: ${err.message}`, 'error');
			} else {
				logger.log(`an email has been sent: ${new Date()} with results: ${results}`, 'info');
			}
			console.log('Done');
		});
		parentCallback(null,
			{
				successfulEmails,
				errorEmails,
			});
	},
};
