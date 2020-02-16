/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains users creation, login, updatation routes
 **************************************************************************/

'use strict';

module.exports = function (app) {

   const authController = require('../../controllers/auth/authCntrl'),
      auth = require('../../utils/auth');

   // create user route
   app.route('/api/v1/signUp')
      .post(authController.signUp)

   // login user route
   app.route('/api/v1/login')
      .post(authController.login)

   // logout current session of the user
   app.route('/api/v1/logoutCS')
      .patch(auth.isAuthunticated, authController.logoutCS)

   // logout all sessions of the user
   app.route('/api/v1/logoutAS')
      .patch(auth.isAuthunticated, authController.logoutAS)

};
