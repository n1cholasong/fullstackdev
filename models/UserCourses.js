const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const UserCourses = db.define('UserCourses', {
});

module.exports = UserCourses;
