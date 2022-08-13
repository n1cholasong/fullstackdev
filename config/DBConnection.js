const mySQLDB = require('./DBConfig');
const Role = require('../models/Role')
const User = require('../models/User');
const Review = require('../models/Review');
const Forum = require('../models/Forum');
const Course = require('../models/Courses');
const Voucher = require('../models/Voucher');
const Quiz = require('../models/Quizes');
const Chapter = require('../models/chapter');
const Video = require('../models/video');
const Comment = require('../models/Comments');
//const ForumLike = require('../models/');
const Courselike = require('../models/CourseLikes');
const ForumLikeFavs = require('../models/ForumLikeFavs');

// If drop is true, all existing tables are dropped and recreated 
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /* Defines the relationship where a user has many videos. The primary key from user will be a foreign key in video. */
            //Declaring the parent realtionship
            Role.hasOne(User);
            User.hasMany(Forum);
            User.hasMany(Review);
            User.hasMany(Courselike);
            User.hasMany(Course);
            User.hasMany(Voucher);
            User.hasMany(Comment);
            User.hasMany(ForumLikeFavs);
            User.hasMany(Course)
            //Course.hasMany(Quiz);
            Course.hasMany(Chapter);
            Course.hasMany(Review);
            Course.hasMany(Courselike);
            Chapter.hasOne(Video);
            Chapter.hasMany(Quiz)
            //Forum bullshit
            Forum.belongsTo(User);
            Forum.hasMany(Comment);
            Forum.hasMany(ForumLikeFavs);
            ForumLikeFavs.belongsTo(User);
            ForumLikeFavs.belongsTo(Forum);
            Comment.belongsTo(User);
            Comment.belongsTo(Forum);
            //Decalring the child realtionship
            Courselike.belongsTo(User);
            Courselike.belongsTo(Course);
            User.belongsTo(Role);
            User.belongsToMany(Course, { through: 'UserCourses' });
            Comment.belongsTo(Forum);
            Chapter.belongsTo(Course);
            Review.belongsTo(Course);
            Quiz.belongsTo(Chapter);
            Video.belongsTo(Chapter);
            Voucher.belongsToMany(User, { through: 'UserVouchers' });
            Course.belongsToMany(User, { through: 'UserCourses' });
            // Course.belongsTo(User)
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB }