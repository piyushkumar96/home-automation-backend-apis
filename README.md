# home-automation-backend-apis
This repository  explains the business requirements of home-automation using devices.

# Technology Stack
1. MEAN stack
2. Postman

**Features:-**
1. Generalise
2. Secured APIs (JSON token)
3. Emailing (sendgrid)
4. logging everything (winston)
5. Well documented 
6. Testing (Jest)

## Note:- Before using this application register on sendgrid and change SENDER_EMAILID & SENDGRID_API_KEY in (dot.env, test.env, config.json)


# To run the Application

# Prerequisites:- 
1. Node   
2. MongoDB (installed and running)
3. Postman

# Steps:- 
1. Download folder “**home-automation-backend-apis**” folder from the Github (https://github.com/piyushkumar96/home-automation-backend-apis).

2. Go inside the “**home-automation-backend-apis**” folder. Check the there should be all the folders mentioned below except the “**node_modules**” folder. 

3. Then run commands

	`cd home-automation-backend-apis`

	`sudo npm install`

	`npm start`                               // to run the application

                or 
                
    `npm test`                               // to test the application

4. Download file home-automation-backend-apis.postman_collection.json the Postman APIs. Then import these APIs using the import feature of Postman.

5. Then Use APIs to use application. 