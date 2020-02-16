/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains functions for generating the random string
 **************************************************************************/

// to enable strict mode
'use strict';

module.exports = {
	// generate random string
	generateString() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 6; i += 1) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
};
