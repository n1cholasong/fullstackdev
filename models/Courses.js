const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const User = require('./User');
const Subject = require('../models/Subject');
const Chapter = require('../models/chapter');
const Quiz = require('../models/Quizes');

async function init(){
    await Courses.findAndCountAll()
    .then(async result => {
        try {
            if (result.count < 1) {
                coursesList.forEach(async function (course) {
                    var course = await Courses.create(course)
                    const progamingSub = await Subject.findAll({ where: { title: "Programming" } })
                    course.addSubjects(progamingSub, { through: "CourseSubjects" })
                })

            };
        } catch (err) {
            console.log(err)
        }
    });


   await Chapter.findAndCountAll()
        .then(async result => {
            try {
                if (result.count < 1) {
                    await Chapter.create({ ChapterNum: 1, CourseId: 1 })
                };
            } catch (err) {
                await Chapter.create({ ChapterNum: 1, CourseId: 4 })
            }
        });

    await  Quiz.findAndCountAll()
        .then(async function (result) {
            try {
                if (result.count < 1) {
    
                    await Quiz.create({
                        question: "What is python",
                        description: "fist question",
                        a1: "A progmaming laungague",
                        a2: "A Type of Snake",
                        a3: "Anaconda?",
                        a4: "I don't know",
                        correctans: "A progmaming laungague",
                        ChapterId: 1
                    })
    
                };
            }
            catch (err) {
                console.log(err)
            }
        });
    }

const Courses = db.define('Courses', {
    courseName: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    content: { type: Seqelize.STRING }
});

Courses.sync();
User.sync();
Subject.sync();
Chapter.sync();
Quiz.sync();

coursesList = [{
    courseName: "Python 101", description: "Basic Python knowdlge", content: "Basic Python knowdlge", userId: 1
}, {
    courseName: "Programing 101", description: "Basic knowdlge on C# python etc", content: "learn how to print Hello world", userId: 2
},
{
    courseName: "Programing C#", description: "Basic knowdlge on C# ", content: "learn how to print Hello world", userId: 1
}]





init();



module.exports = Courses