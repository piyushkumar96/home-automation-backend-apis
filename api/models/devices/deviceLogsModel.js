/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains user Model require for creating user
 **************************************************************************/

'use strict';

//External modules
const mongoose = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

//Internal modules
const config = require('../../../config/config.json');

const Schema = mongoose.Schema;

const devLogsSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    devId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    devName: {
        type: String,
        required: true,
        trim: true
    },
    devType: {
        type: String,
        required: true,
        trim: true
    },
    logs: []
})

const devicelogs = mongoose.model('devicelogs', devLogsSchema);
module.exports = devicelogs
