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
      devicesController = require('../../controllers/devices/devicesCntrl'),
      auth = require('../../utils/auth');

   // add the bulb to the network
   app.route('/api/v1/addBulb')
      .post(auth.isAuthunticated, bulbsController.addBulb)

   // Change color of bulb
   app.route('/api/v1/changeBulbColor')
      .patch(auth.isAuthunticated, bulbsController.changeBulbColor)

   // increase or decrease the brightness of bulb
   app.route('/api/v1/setBulbBrightness')
      .patch(auth.isAuthunticated, bulbsController.setBulbBrightness)

   // add the fan to the network
   app.route('/api/v1/addFan')
      .post(auth.isAuthunticated, fansController.addFan)

   // increase or decrease the speed of fan
   app.route('/api/v1/setFanSpeed')
      .patch(auth.isAuthunticated, fansController.setFanSpeed)

   // add the AC to the network
   app.route('/api/v1/addAC')
      .post(auth.isAuthunticated, ACsController.addAC)

   // increase or decrease the temperature of AC
   app.route('/api/v1/setACTemperature')
      .patch(auth.isAuthunticated, ACsController.setACTemperature)

   // Power On or Off to the  devices
   app.route('/api/v1/powerOnOff')
      .patch(auth.isAuthunticated, devicesController.powerOnOff)

   // remove device from network
   app.route('/api/v1/removeDevice')
      .patch(auth.isAuthunticated, devicesController.removeDevice)

   // adding back device which is removed from network
   app.route('/api/v1/addDeviceToNwk')
      .patch(auth.isAuthunticated, devicesController.addDeviceToNwk)

   // getting a device from device Id
   app.route('/api/v1/getDeviceById/:devId')
      .get(auth.isAuthunticated, devicesController.getDeviceById)

   // get all devices of same device type
   app.route('/api/v1/getAllDevsSameType/:devType')
      .get(auth.isAuthunticated, devicesController.getAllDevsSameType)

   // get all devices in room 
   app.route('/api/v1/getAllDevsInRoom/:roomNum')
      .get(auth.isAuthunticated, devicesController.getAllDevsInRoom)

   // get all devices at a floor 
   app.route('/api/v1/getAllDevsAtFloor/:floor')
      .get(auth.isAuthunticated, devicesController.getAllDevsAtFloor)

   // get logs of device
   app.route('/api/v1/getDeviceLogs/:devId')
      .get(auth.isAuthunticated, devicesController.getDeviceLogs)
      

};
