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
const helpers = require('./helpers/handlebars');
const User = require('./models/User');
const Courses = require('./models/Courses');
const Quiz = require('./models/Quizes');
const Chapter = require('./models/chapter');
const Forum = require('./models/Forum');
const Review = require('./models/Review');

async function setupAcc(userList) {
	let user = await User.create({
		email: userList[0],
		username: userList[1],
		password: userList[2],
		fname: userList[3],
		lname: userList[4],
		gender: userList[5],
		birthday: userList[6],
		country: userList[7],
		interest: userList[8],
		status: userList[9],
		profilePicURL: userList[10],
		role: userList[11],
		active: userList[12]
	});

	if (userList[1] == "n1cholas.ong") {
		var course = await Courses.create({
			courseName: "Python", description: "Learn Python with us!!!", content: "Learn Python with us!!!", userId: user.id
		})

		var chapter = await Chapter.create({
			ChapterNum: 1,
			CourseId: course.id
		})

		await Review.create(
			{ review: "Python is good", rating: 5, userId: user.id, CourseId: course.id, report: 0 }
		)

		await Quiz.create({
			question: "What is python?", description: "", a1: "It is an programing laung", a2: "The Snake DUH", a3: "Anaconda?", a4: "Anaconda?", correctans: "It is an programing laung", ChapterId: chapter.id
		})

		await Forum.create(
			{
				topic: "Python", description: "Python is good", pictureURL: "null", status: "Created", likes: "Good", userId: user.id
			}
		)
	}
	return user
}

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
* 
*/
app.engine('handlebars', engine({
	helpers: helpers,
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

// Library to use MySQL to store session objects
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

const resetDB = false;
const DBConnection = require('./config/DBConnection');
DBConnection.setUpDB(resetDB) // To set up database with new tables


// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'curodemy_session',
	secret: 'ymedoruc',
	//store: new MySQLStore(options),
	resave: false,
	saveUninitialized: false,
}));

// Messaging libraries
const flash = require('connect-flash');
app.use(flash());
const flashMessenger = require('flash-messenger');
app.use(flashMessenger.middleware);

// Passport Config
const passport = require('passport');
const passportConfig = require('./config/passportConfig');
passportConfig.localStrategy(passport);

// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Place to define global variables
app.use(function (req, res, next) {
	res.locals.messages = req.flash('message');
	res.locals.errors = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// mainRoute is declared to point to routes/main.js
const mainRoute = require('./routes/main');
const forumRoute = require('./routes/forum');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const paymentRoute = require('./routes/payment');
const courseRoute = require('./routes/courses');


// Any URL with the pattern ‘/*’ is directed to routes/main.js
app.use('/', mainRoute);
app.use('/forum', forumRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/payment', paymentRoute);
app.use('/course', courseRoute);

/*
* Creates a port for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */
const port = 5000;

// Starts the server and listen to port
app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});

if (!resetDB) {
	adminAcc =
		[
			['nicholasong75@gmail.com', 'n1cholas.ong', '$2a$10$sUm1yYEeoTRYxTEDyxqVFuaETT4mMBk0vYgPgrJrgVQ98YRP9NBRm', 'Nicholas', 'Ong', 'M', null, 'SG', 'productivity,artsncrafts,langauge', null, null, 'ADMIN', 1],
			['Nat@gmail.com', 'nat', '$2a$10$kFXNArrd0alYlG/zCzGfz./0m86G4Amgdub6656CHR4i.Aysc8NUi', 'Nat', 'Lee', 'M', '1995-09-30', 'US', 'photography,productivity,langauge', null, null, 'ADMIN', 1],
			['lucaslee@gmail.com', 'Xepvoid', '$2a$10$6fwMyC0jwW34PznlgWM8wOoyx1ritkY38XnklD4g4QLLyxoErxiyy', 'Lucas', 'Lee', 'M', '2004-01-17', 'SG', 'programming,productivity,selfhelp', null, null, 'ADMIN', 1],
			['Kiat0878@gmail.com', 'Kiat10', '$2a$10$jCtrCrWCNFhXI9kpEOgEeeTHxJi5yLFO2Bfkg.fZ2bJ2rx1qOD6mS', 'Kai Kiat', 'Lo', null, '2002-01-31', 'AT', 'programming,productivity,langauge,selfhelp', null, null, 'ADMIN', 1],
			['johnsmith123@curodemy.com', 'johnsmith23', '$2a$10$MSYP/5u38iPwbk9gqyeuAeoN7cDzQwy32x9paLMu13l1fiewJ5hhS', 'John', 'Smith', '', null, '', null, null, null, 'STUDENT', 1]
		]

	User.findByPk(1).then((user) => {
		if (user == null) {
			adminAcc.forEach(async (acc) => {
				try {
					//console.log(acc)
					var user = await setupAcc(acc)
					//console.log(user)

				} catch (error) {

					console.log(error)

				}
			})
		}
	})


}