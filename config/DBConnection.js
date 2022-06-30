const mySQLDB = require('./DBConfig');
const User = require('../models/User')
const Review = require('../models/Review')
const Forum = require('../models/Forum');

// If drop is true, all existing tables are dropped and recreated 
const setUpDB = (drop) => { 
    mySQLDB.authenticate() 
    .then(() => { 
        console.log('Database connected'); 
        /* Defines the relationship where a user has many videos. The primary key from user will be a foreign key in video. */ 
        User.hasMany(Forum);
        User.hasMany(Review)
        Forum.belongsTo(User);
        mySQLDB.sync({ 
            force: drop 
        }); }) 
        .catch(err => console.log(err)); 
    };

module.exports = {setUpDB}