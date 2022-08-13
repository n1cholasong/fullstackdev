const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const Courselikes = db.define('courselikes', {
    liked: { type: Seqelize.TINYINT(1), defaultValue: '1'}
});



module.exports = Courselikes;