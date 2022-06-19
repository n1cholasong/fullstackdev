/*
* 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
* in this JS file.
* */
const express = require('express');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
// require('dotenv').config();

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();

// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', engine({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Express middleware to parse HTTP body in order to read HTTP data
app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// const MySQLStore = require('express-mysql-session');
// var options = { 
// 	host: process.env.DB_HOST, 
// 	port: process.env.DB_PORT, 
// 	user: process.env.DB_USER, 
// 	password: process.env.DB_PWD, 
// 	database: process.env.DB_NAME, 
// 	clearExpired: true, 
// 	// The maximum age of a valid session; milliseconds:
// 	 expiration: 3600000, // 1 hour = 60x60x1000 milliseconds 
// 	// How frequently expired sessions will be cleared; milliseconds: 
// 	checkExpirationInterval: 1800000 // 30 min 
// };


// const DBConnection = require('./config/DBConnection');
// DBConnection.setUpDB(true) // To set up database with new tables


// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'vidjot_session',
	secret: 'tojdiv',
	//store: new MySQLStore(options),
	resave: false,
	saveUninitialized: false,
}));

// Place to define global variables
app.use(function (req, res, next) {
	next();
});

// mainRoute is declared to point to routes/main.js
const mainRoute = require('./routes/main');
const forumRoute = require('./routes/forum');
const loginRoute = require('./routes/login');
const paymentRoute = require('./routes/payment');

// Any URL with the pattern ‘/*’ is directed to routes/main.js
app.use('/', mainRoute);
app.use('/forum', forumRoute);
app.use('/login', loginRoute );
app.use('/payment', paymentRoute);


/*
* Creates a port for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */
const port = 5000;

// Starts the server and listen to port
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});