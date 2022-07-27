const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Review = db.define('review', {
    review: { type: Seqelize.STRING(2000) },
    rating: { type: Seqelize.INTEGER },
    reply: { type: Seqelize.STRING(2000) },
    report: { type: Seqelize.INTEGER },
});

module.exports = Review