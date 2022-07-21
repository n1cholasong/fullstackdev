const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Forum = db.define('forum', {
    topic: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    pictureURL: { type: Seqelize.STRING },
    status : {type: Seqelize.INTEGER}

});

module.exports = Forum