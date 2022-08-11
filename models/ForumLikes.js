const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const ForumLikes = db.define('forumlikes', {
    liked: { type: Seqelize.TINYINT(1), defaultValue: '1'}
});



module.exports = ForumLikes;