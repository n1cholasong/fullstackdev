const mySQLDB = require('./DBConfig');
const User = require('../models/User')
const Review = require('../models/Review')
const Forum = require('../models/Forum');
const Course = require('../models/Courses')
const Voucher = require('../models/Voucher')


// If drop is true, all existing tables are dropped and recreated 
const setUpDB = (drop) => { 
    mySQLDB.authenticate() 
    .then(() => { 
        console.log('Database connected'); 
        /* Defines the relationship where a user has many videos. The primary key from user will be a foreign key in video. */ 
        User.hasMany(Forum);
        Forum.belongsTo(User);
        User.hasMany(Course);
        User.hasMany(Voucher);
        Voucher.belongsToMany(User,{through: 'UserVouchers'})
        Course.belongsToMany(User,{through: 'UserCourses'});
       // Course.belongsTo(User)
        mySQLDB.sync({ 
            force: drop 
        }); }) 
        .catch(err => console.log(err)); 
    };

module.exports = {setUpDB}