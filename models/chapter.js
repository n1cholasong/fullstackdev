const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const Chapter = db.define('Chapter', {
    ChapterNum : { type: Seqelize.INTEGER }
});

module.exports = Chapter;
