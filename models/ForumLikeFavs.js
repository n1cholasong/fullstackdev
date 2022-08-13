const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const ForumLikeFavs = db.define('forumlikefav', {
    liked: { type: Seqelize.TINYINT(1), defaultValue: '0'},
    topic: { type: Seqelize.STRING },
    favourite: { type: Seqelize.TINYINT(1), defaultValue: '0'}
});



module.exports = ForumLikeFavs;