const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Comment = db.define('comment', {
    comment: { type: Seqelize.STRING },
    
});

module.exports = Comment