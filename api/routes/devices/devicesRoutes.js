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
      fansController = require('../../controllers/devices/fansCntrl'),
      ACsController = require('../../controllers/devices/acsCntrl'),
      auth = require('../../utils/auth');

   // add the bulb to the network
   app.route('/api/v1/addBulb')
      .post(auth.isAuthunticated, bulbsController.addBulb)

   // Power On or Off to the bulb
   app.route('/api/v1/powerOnOffBulb')
      .patch(auth.isAuthunticated, bulbsController.powerOnOffBulb)

   // Change color of bulb
   app.route('/api/v1/changeBulbColor')
      .patch(auth.isAuthunticated, bulbsController.changeBulbColor)

   // increase or decrease the brightness of bulb
   app.route('/api/v1/setBrightness')
      .patch(auth.isAuthunticated, bulbsController.setBrightness)

   // add the fan to the network
   app.route('/api/v1/addFan')
      .post(auth.isAuthunticated, fansController.addFan)

   // Power On or Off to the fan
   app.route('/api/v1/powerOnOffFan')
      .patch(auth.isAuthunticated, fansController.powerOnOffFan)

   // increase or decrease the speed of fan
   app.route('/api/v1/setFanSpeed')
      .patch(auth.isAuthunticated, fansController.setFanSpeed)

   // add the AC to the network
   app.route('/api/v1/addAC')
      .post(auth.isAuthunticated, ACsController.addAC)

   // Power On or Off to the AC
   app.route('/api/v1/powerOnOffAC')
      .patch(auth.isAuthunticated, ACsController.powerOnOffAC)

   // increase or decrease the temperature of AC
   app.route('/api/v1/setACTemperature')
      .patch(auth.isAuthunticated, ACsController.setACTemperature)


};
