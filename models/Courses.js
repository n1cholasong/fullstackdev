const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const User = require('./User');

const Courses = db.define('Courses', {
    courseName: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    content: { type: Seqelize.STRING }
});

Courses.sync();
User.sync();

coursesList = [{
    courseName: "Python 101", description: "Basic Python knowdlge", content: "Basic Python knowdlge", userId: 1
}, {
    courseName: "Programing 101", description: "Basic knowdlge on C# python etc", content: "learn how to print Hello world", userId: 2
},
{
    courseName: "Programing C#", description: "Basic knowdlge on C# ", content: "learn how to print Hello world", userId: 1
}]


Courses.findAndCountAll()
    .then(async result => {
        try {
            if (result.count < 1) {
                coursesList.forEach(async function (course) {
                    await Courses.create(course)
                })

            };
        } catch (err) {
            console.log(err)
        }
    });

module.exports = Courses