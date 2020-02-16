/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains users getprofile, profile updation, deletion etc.
 **************************************************************************/

'use strict';

module.exports = function (app) {

   const usersController = require('../../controllers/user/usersCntrl'),
      auth = require('../../utils/auth');

   // get user profile by id
   app.route('/api/v1/getUserById/:id')
      .get(auth.isAuthunticated, usersController.getUserById)

   // get user profile
   app.route('/api/v1/user/me')
      .get(auth.isAuthunticated, usersController.getProfile)

   // update the user's profile
   app.route('/api/v1/updateUserProfile')
      .patch(auth.isAuthunticated, usersController.updateUserProfile)

   //update the user's password
   app.route('/api/v1/updateUserPassword')
      .patch(auth.isAuthunticated, usersController.updateUserPassword)

   //delete the user
   app.route('/api/v1/deleteUser')
      .delete(auth.isAuthunticated, usersController.deleteUser)

};
