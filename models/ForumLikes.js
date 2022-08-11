const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Forum = db.define('forumlikes', {
    liked: { type: Seqelize.TINYINT(1) }
});

module.exports = Forum