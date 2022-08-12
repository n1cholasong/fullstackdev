const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const ForumFav = db.define('forumfav', {
    topic: { type: Seqelize.STRING },
    favourite: { type: Seqelize.TINYINT(1), defaultValue: '1'}
});



module.exports = ForumFav;