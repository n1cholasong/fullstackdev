const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Courses = db.define('Courses', {
    courseName: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    content: { type: Seqelize.STRING}
});

module.exports = Courses