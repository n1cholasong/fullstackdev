const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Courses = db.define('Courses', {
    courseName: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    creatorId: {type: Seqelize.NUMBER}
});

module.exports = Courses