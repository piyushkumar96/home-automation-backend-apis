/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file is used for setting up the environment variables for testing users routes
 **************************************************************************/

'use strict';

//External Modules 
const mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    uuidv4 = require('uuid/v4');

// Internal Modules
const userSchema = require('../../../api/models/users/usersModel'),
    devLogsSchema = require('../../../api/models/devices/deviceLogsModel'),
    config = require('../../../config/config.json');

const userOneId = new mongoose.Types.ObjectId()
const userId = uuidv4()
const date = new Date()
const userOne = {
    _id: userOneId,
    Id: userId,
    name: 'Piyu Kumar',
    email: 'piyu@gmail.com',
    password: 'Welcome@123',
    age: 23,
    devCounts: {
        "bulb": 1,
        "fan": 0,
        "ac": 0
    },
    devices : [ 
        {
            "devName" : "Party bulb",
            "manufacturer" : "philips",
            "model" : "led",
            "serialNumber" : "qwerty456",
            "houseDetails" : {
                "roomNum" : 1,
                "floor" : 1
            },
            "deviceFeatures" : {
                "status" : "off",
                "brightness" : 0,
                "color" : "white",
                "condition" : "working"
            },
            "lastUsed" : new Date(),
            "inNetwork" : true,
            "devType" : "bulb",
            "_id" : new mongoose.Types.ObjectId(),
            "devId" : "BULB1"
        }
    ],
    tokens: [{
        token: jwt.sign({ _id: userOneId }, config.auth.jwt_secret)
    }]
}

const devLogOneId = new mongoose.Types.ObjectId()
const devLogOne = {
    "_id" : devLogOneId,
    "logs" : [ 
        `This device is added to the network for the first time at ${date}.`
    ],
    "userId" : userId,
    "devId" : "BULB1",
    "devName" : "Party bulb",
    "devType" : "bulb"
}

const setupDatabase = async () => {
    await userSchema.deleteMany()
    await devLogsSchema.deleteMany()
    await new userSchema(userOne).save()
    await new devLogsSchema(devLogOne).save()
}

module.exports = {
    userOne,
    userOneId,
    setupDatabase
}
