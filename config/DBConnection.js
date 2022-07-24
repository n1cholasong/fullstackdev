const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Review = require('../models/Review');
const Forum = require('../models/Forum');
const Course = require('../models/Courses');
const Voucher = require('../models/Voucher');
const Quiz = require('../models/Quizes');
const Chapter = require('../models/chapter');
const Video  = require('../models/video');

// If drop is true, all existing tables are dropped and recreated 
const setUpDB = (drop) => { 
    mySQLDB.authenticate() 
    .then(() => { 
        console.log('Database connected'); 
        /* Defines the relationship where a user has many videos. The primary key from user will be a foreign key in video. */ 
       //Declaring the parent realtionship
        User.hasMany(Forum);
        User.hasMany(Review);
        User.hasMany(Course);
        User.hasMany(Voucher);
        //Course.hasMany(Quiz);
        Course.hasMany(Chapter);
        Course.hasMany(Review);
        Chapter.hasOne(Video);
        Chapter.hasMany(Quiz)
        //Decalring the child realtionship
        Forum.belongsTo(User);
        Chapter.belongsTo(Course);
        Review.belongsTo(Course);
        Quiz.belongsTo(Chapter);
        Video.belongsTo(Chapter);
        Voucher.belongsToMany(User,{through: 'UserVouchers'});
        Course.belongsToMany(User,{through: 'UserCourses'});
       // Course.belongsTo(User)
        mySQLDB.sync({ 
            force: drop 
        }); }) 
        .catch(err => console.log(err)); 
    };

module.exports = {setUpDB}