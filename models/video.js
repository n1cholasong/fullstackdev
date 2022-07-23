const sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Video = db.define('Video', {
    chapter:{ type: sequelize.INTEGER },
    videoname: { type: sequelize.STRING },
    videofile: { type: sequelize.STRING },
});

module.exports = Quizes