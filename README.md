# home-automation-backend-apis
This repository  explains the business requirements of home-automation using devices.

# Technology Stack
1. MEAN stack
2. Postman

**Features:-**
1. Generalise
2. OOPs
3. Secured APIs (JSON token)
4. Emailing (sendgrid)
5. logging everything (winston)
6. Well documented 
7. Testing (Jest)

## Note:- Before using this application register on sendgrid and change SENDER_EMAILID & SENDGRID_API_KEY in (dot.env, test.env, config.json)


# To run the Application

# Prerequisites:- 
1. Node   
2. MongoDB (installed and running)
3. Postman

# Steps:- 
1. Download folder “**home-automation-backend-apis**” folder.

2. Go inside the “**home-automation-backend-apis**” folder. Check the there should be all the folders mentioned below except the “**node_modules**” folder. 

3. Then run commands

	`cd home-automation-backend-apis`

	`sudo npm install`

	`npm start`                               // to run the application

                or 
                
    `npm test`                               // to test the application

4. Download file home-automation-backend-apis.postman_collection.json the Postman APIs. Then import these APIs using the import feature of Postman.

5. Then Use APIs to use application. 

-------------------------------------------------------------------------------------------------------------------------
														             Solution Approach
-------------------------------------------------------------------------------------------------------------------------

##Description

There are **two schemas** one for the **user** and others for storing the **logs** of devices. And **devices are stored into the user's profile**. Whenever there are any changes made to devices, the logs will be stored in the database. There is a **virtual network in which all the devices are connected to it**. When you add any devices it is added to this network. Now you can manage and change the properties of the device like brightness, color, speed, temperature. And even you **can remove the device from this network(I have maintained a boolean flag named "InNetwork"** in DB, So if it is true then its in-network right now otherwise not.

**Note:-** In the real case scenario, we will **Rasberry pie** and to handle **real-time communication we will use web sockets and events programming**.

-------------------------------------------------------------------------------------------------------------------------

#Steps to test the project:- 

1. Register the user.

2. Log in to the user.

3. Now you can add devices like a bulb, fan, ACs into the network.

4. After that, you are able to manage the features of devices that are added to the network.

5. You can remove the devices as well.

6. You can also see the logs of devices

7. You can also test the application by running **npm test** in new terminal

-------------------------------------------------------------------------------------------------------------------------

#Features Provided:- 

1. **User**

	a) signUp

	b) login

	c) logout current sessions

	d) log out all the sessions

	e) get the user by id

	f) get user profile

	g) update users profile

	h) update users password

	i) delete the user

	j) get all the devices 

	k) get all the devices within the network

2. **Devices (Bulb, Fan, ACs)**

	a) add devices

	b) for the bulb (change color, brightness)

	c) for the fan (change speed)

	d) for ac (change temperature)

	e) power on / offf) remove the device from the network

	g) add the device back into the network

	h) get all the devices within the network

	i) get all the devices

	j) get the devices in a room or at the floor

	k) get logs of the devices

-------------------------------------------------------------------------------------------------------------------------
												END

-------------------------------------------------------------------------------------------------------------------------