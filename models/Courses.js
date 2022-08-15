const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const User = require('./User');
const Subject = require('../models/Subject');
const Chapter = require('../models/chapter');
const Quiz = require('../models/Quizes');
const Video = require('../models/video');

async function init() {
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

    await Quiz.findAndCountAll()
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

coursesList =
    [
        {
            courseName: "Python 101", description: "Basic Python knowdlge", content: "Basic Python knowdlge", userId: 1
        },
        {
            courseName: "Programing 101", description: "Basic knowdlge on C# python etc", content: "learn how to print Hello world", userId: 2
        },
        {
            courseName: "Programing C#", description: "Basic knowdlge on C# ", content: "learn how to print Hello world", userId: 3
        }
    ]

subjectList =
    [
        { title: "Others", description: "A melting pot of knowledge." },
        { title: "Photography", description: "A picture is worth a thousand words." },
        { title: "Science", description: "All of science is nothing more than the refinement of everyday thinking." },
        { title: "Programming", description: "If it works, don't touch it." },
        { title: "DIY", description: "If you can dream it, you can do it!" },
        { title: "Productivity", description: "Success isn't about getting more done, it's about having more fun." },
        { title: "Arts n' Craft", description: "Creativity is intelligence having fun" },
        { title: "Mathematics", description: "Wherever there is number, there is beauty." },
        { title: "Language", description: "A different language is a different vision of life." },
        { title: "Self Help", description: "It's never too late for a new beginning in your life." }
    ];

Subject.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            subjectList.forEach(subject => {
                Subject.create(subject)
            });
        }
    })

init();



module.exports = Courses