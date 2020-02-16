/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains routes to add, update, remove the devices
 **************************************************************************/

// to enable strict mode
'use strict';

module.exports = function (app) {

   const bulbsController = require('../../controllers/devices/bulbsCntrl'),
      auth = require('../../utils/auth');

   // add the bulb to the network
   app.route('/api/v1/addBulb')
      .post(auth.isAuthunticated, bulbsController.addBulb)

   // Power On or Off to the bulb
   app.route('/api/v1/powerOnOff')
      .patch(auth.isAuthunticated, bulbsController.powerOnOff)

   // Change color of bulb
   app.route('/api/v1/changeColor')
      .patch(auth.isAuthunticated, bulbsController.changeColor)

   // increase or decrease the brightness of bulb
   app.route('/api/v1/setBrightness')
      .patch(auth.isAuthunticated, bulbsController.setBrightness)

   // // get user profile
   // app.route('/api/v1/user/me')
   //    .get(auth.isAuthunticated, usersController.getProfile)

   // // update the user's profile
   // app.route('/api/v1/updateUserProfile')
   //    .patch(auth.isAuthunticated, usersController.updateUserProfile)

   // //update the user's password
   // app.route('/api/v1/updateUserPassword')
   //    .patch(auth.isAuthunticated, usersController.updateUserPassword)

   // //delete the user
   // app.route('/api/v1/deleteUser')
   //    .delete(auth.isAuthunticated, usersController.deleteUser)

};
