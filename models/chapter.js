const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const Courses = require('./Courses');


const Chapter = db.define('Chapter', {
    ChapterNum : { type: Seqelize.INTEGER }
});

Chapter.sync();

Chapter.findAndCountAll()
    .then(async result => {
        try{
        if (result.count < 1) {
            await Chapter.create({ChapterNum:1,CourseId:1})
        };
    }catch(err){
        await Chapter.create({ChapterNum:1,CourseId:4})
    }
    });


module.exports = Chapter;
