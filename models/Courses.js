const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const User = require('./User');
const Subject = require('../models/Subject');
const Chapter = require('../models/chapter');
const Quiz = require('../models/Quizes');
const Video = require('../models/video');

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

        await  Video.findAndCountAll()
        .then(async function (result){
            if (result.count < 1) {
                Video.create({
                    videoname:"filler",
                    videofile:"/uploads/filler/3-1%20Use%20Case%20Description%201.mp4",
                    ChapterId:1
                })
            }
        })

    }

const Courses = db.define('Courses', {
    courseName: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    content: { type: Seqelize.STRING },
    imgURL: { type: Seqelize.STRING },
    content: { type: Seqelize.STRING }
});

Courses.sync();
User.sync();
Subject.sync();
Chapter.sync();
Quiz.sync();
Video.sync();

coursesList = [{
    courseName: "Python 101", description: "Basic Python knowdlge", content: "Basic Python knowdlge", userId: 1,imgURL:"/uploads/filler/python-programming-language.png"
}, {
    courseName: "Programing 101", description: "Basic knowdlge on C# python etc", content: "learn how to print Hello world", userId: 2,imgURL:"/uploads/filler/Unofficial_JavaScript_logo_2.svg_.png"
},
{
    courseName: "Programing C#", description: "Basic knowdlge on C# ", content: "learn how to print Hello world", userId: 1,imgURL:"/uploads/filler/download(1).png"
}]





init();



module.exports = Courses