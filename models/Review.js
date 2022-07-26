const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Review = db.define('review', {
    review: { type: Seqelize.STRING(2000) },
    rating: { type: Seqelize.INTEGER },
    userName: { type: Seqelize.STRING },
    reply: { type: Seqelize.STRING(2000) },
});

module.exports = Review