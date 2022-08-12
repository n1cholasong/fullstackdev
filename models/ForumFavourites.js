const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const ForumFav = db.define('forumfav', {
    favourite: { type: Seqelize.TINYINT(1), defaultValue: '1'}
});



module.exports = ForumFav;