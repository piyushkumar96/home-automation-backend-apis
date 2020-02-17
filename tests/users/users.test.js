/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains all test cases for users
 **************************************************************************/

'use strict';

//External Modules 
const request = require('supertest');

// Internal Modules
const server = require('../../server'),
    userModel = require('../../api/models/users/usersModel');

const { userOne, userOneId, setupDatabase } = require('../fixtures/users/users')

beforeEach(setupDatabase)

// test for creating the new User
test('Should create a New User', async () => {
    const response = await request(server)
        .post('/api/v1/signUp')
        .send({
            name: 'Piyush Kumar',
            email: 'piyush25032@gmail.com',
            password: 'Welcome@123',
            age: 23

        })
        .expect(201)

    // Assert that the DB was changed successfully
    const user = await userModel.findById(response.body.data.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body.data).toMatchObject({
        user: {
            name: 'Piyush Kumar',
            email: 'piyush25032@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Welcome@123')
})

// test for login Process
test('Should login existing user', async () => {
    const response = await request(server)
        .post('/api/v1/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await userModel.findById(userOneId)
    expect(response.body.data.token).toBe(user.tokens[1].token)

})

// test for authentication failed
test('Should not login nonexistent user', async () => {
    await request(server)
        .post('/api/v1/login')
        .send({
            email: userOne.email,
            password: 'IncorrectPassword'
        })
        .expect(400)
})

//test for getting the user profile
test('Should get profile for user', async () => {
    await request(server)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// test for authentication failed for getting user profile
test('Should not get profile for unauthenticated user', async () => {
    await request(server)
        .get('/api/v1/user/me')
        .send()
        .expect(401)
})

// test for adding bulb
test('Should add bulb', async () => {
    await request(server)
        .post('/api/v1/addBulb')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "devName": "Disco bulb",
            "manufacturer": "philips",
            "model": "led",
            "serialNumber": "qwerty123",
            "houseDetails": {
                "roomNum": 2,
                "floor": 1
            }
        })
        .expect(200)
})

// test for power on the bulb
test('Should power on the bulb', async () => {
    await request(server)
        .patch('/api/v1/powerOnOff')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "devId": "BULB1",
            "devType": "bulb",
            "status": "on"
        })
        .expect(200)
})

// test for change the color of the bulb
test('Should Change color of the bulb', async () => {
    await request(server)
        .patch('/api/v1/changeBulbColor')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "devId": "BULB1",
            "color": "blue"
        })
        .expect(200)
})

// test for increase the brightness of the bulb
test('Should Change brightness of the bulb', async () => {
    await request(server)
        .patch('/api/v1/setBulbBrightness')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "devId": "BULB1",
            "brightness": 20
        })
        .expect(200)
})

// test to remove the device from network
test('Should remove the device from network', async () => {
    await request(server)
        .patch('/api/v1/removeDevice')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "devId": "BULB1",
            "devType": "bulb"
        })
        .expect(200)
})

// test to add the device back into the network
test('Should add the device back into the network', async () => {
    await request(server)
        .patch('/api/v1/addDeviceToNwk')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "devId": "BULB1",
            "devType": "bulb"
        })
        .expect(200)
})


//  test to get device by Id
test('Should get the device of given Id', async () => {
    const response = await request(server)
        .get('/api/v1/getDeviceById/BULB1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)

        expect(response.body.data[0].devId).toBe("BULB1")
})

// test to get all devices
test('Should get all the devices', async () => {
    await request(server)
        .get('/api/v1/getAllDevices')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)
})

// test to get all devices of same type here it is bulb
test('Should get all the devices of same type', async () => {
    await request(server)
        .get('/api/v1/getAllDevsSameType/bulb')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)
})

// test to get all devices in the network
test('Should get all the devices in the network', async () => {
    await request(server)
        .get('/api/v1/getAllDevicesInNwk')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)
})

// test to get all devices in room Number 1
test('Should get all the devices in room number 1', async () => {
    await request(server)
        .get('/api/v1/getAllDevsInRoom/1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)
})

// test to get all devices at floor 1
test('Should get all the devices at floor 1', async () => {
    await request(server)
        .get('/api/v1/getAllDevsAtFloor/1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)
})

// test to get logs of a device
test('Should get all the devices in room number 1', async () => {
    await request(server)
        .get('/api/v1/getDeviceLogs/BULB1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(200)
})

// test for deleting the user
test('Should delete the user', async () => {
    await request(server)
        .delete('/api/v1/deleteUser')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await userModel.findById(userOneId)
    expect(user).toBeNull()
})

// test for authentication failed for deleting the user
test('Should not delete account for unauthenticate user', async () => {
    await request(server)
        .delete('/api/v1/deleteUser')
        .send()
        .expect(401)
})

// test for updating the valid user fields
test('Should update valid user fields', async () => {
    await request(server)
        .patch('/api/v1/updateUserProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 30
        })
        .expect(200)
    const user = await userModel.findById(userOneId)
    expect(user.age).toEqual(30)
})

