/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/home-automation-backend-apis
* 
*   This file contains the server confrigurations
 **************************************************************************/

// to enable strict mode
        "use strict";

//External modules
const   express     = require('express'),       // for creating the http server
        bodyParser  = require('body-parser'),   // extract the entire body portion of an incoming request stream and exposes it on req.body
        cors        = require('cors'),          // allows AJAX requests to skip the Same-origin policy and access resources from remote hosts.
        mongoose    = require('mongoose');

        require('dotenv').config();             // loads environment variables from a .env file into process.env. 

//Internal modules
const   config = require('./config/config.json'),      // contains golbal configuration varibales
        Logger = require('./api/utils/logger'),           // logger confriguration files    
        //userRoutes = require('./api/routes/users/usersRoute'),
        authRoutes = require('./api/routes/auth/authRoutes');


//variables
const port          = process.env.PORT  || config.port,
      dbconnection  = process.env.DB    || config.db,
      loggerName    = "[Server]: ";

const logger = new Logger();      
const app = express();                                // express server creation 

app.use(cors());                                // using the middleware for cross origin resources
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));   
app.use(bodyParser.json({ limit: '100mb'}));

process.on('SIGINT', () => {
	logger.log(loggerName + ' Stopping The Server', 'info');
	process.exit();
});

app.on('uncaughtException' , function(err){                     // full event listener for uncaught exception
    logger.log(loggerName + " UNCAUGHT EXCEPTION: " + err , "error");
})

app.on('error', function(err){                                  // full event listener for error
    logger.log(loggerName + " ERROR: " + err, "error"); 
})

mongoose.Promise = global.Promise;
mongoose.connect(dbconnection, { useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error: "));       // full event listener for database connection
db.once('open', function(){                                              // one time event listerner 
    logger.log(loggerName + ' Connection with MongoDB installed ', 'info');
})

// Enable Cross Origin Resource Sharing
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Origin,Content-type,Accept,X-Access-Token,X-Key,Cache-Control,X-Requested-With,Access-Control-Allow-Origin,Access-Control-Allow-Credentials');
    
    if (req.method === 'OPTIONS') {             // if there is any OPTIONS method request then block it for security purpose.
        res.status(200).end();
    } else {
        next();                                 // allow other methods         
    }
});

//userRoutes(app)
authRoutes(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    logger.log(loggerName + ' the url you are trying to reach is not hosted on our server', 'error');
	const err = new Error('Not Found');
	err.status = 404;
	res.status(err.status).json({ type: 'error', message: 'the url you are trying to reach is not hosted on our server' });
	next(err);
});

//running the application on given port
app.listen(port);

logger.log(loggerName + ' api server started on: ' + port, 'info');
module.exports = app