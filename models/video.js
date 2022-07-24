const sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Video = db.define('Video', {
    videoname: { type: sequelize.STRING },
    videofile: { type: sequelize.STRING },
});

module.exports = Video