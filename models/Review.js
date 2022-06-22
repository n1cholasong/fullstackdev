const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Review = db.define('review', {
    review: { type: Seqelize.STRING(2000) },
    rating: { type: Seqelize.STRING },
    userName: { type: Seqelize.STRING }
});

module.exports = Review