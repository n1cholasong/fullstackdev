const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const ForumLikeFavs = require('./ForumLikeFavs');
const User = require('./User');
const Comments = require('./Comments');

const Forum = db.define('forum', {
    topic: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    pictureURL: { type: Seqelize.STRING },
    status: { type: Seqelize.TINYINT(1) }

});

Forum.sync()
User.sync()
ForumLikeFavs.sync()
Comments.sync()

forumtestdata = [
    //Topic, Description, status, userId, forumId
    ["Help in python", "Need help in understanding python OOP", 1, 2, 1],
    ["Нужна помощь по русски", "Want to speak in russian", 1, 3, 2],
    ["Cooking recipes", "Come and share cooking recipies", 1, 4, 3],
    ["Photograph", "Photography tips", 1, 3, 4],
    ["Java", "Learning Java", 1, 3, 5],
    ["C#", "C# supports", 1, 3, 6]
]

Forum.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            forumtestdata.forEach((value) => {
                Forum.create({
                    topic: value[0],
                    description: value[1],
                    status: value[2],
                    userId: value[3]
                });
            });
        }
    });



ForumLikeFavs.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            forumtestdata.forEach((value) => {
                ForumLikeFavs.create({
                    topic: value[0],
                    liked: 1,
                    userId: 3,
                    forumId: value[4]
                });
            });
        }
    });

commentsTestData = [
    //comment, forumId, userId
    ["Hi", 3, 3],
    ["Hello", 3, 1],
    ["I need help in oop", 3, 3],
    ["Which part?", 3, 4],
    ["What is a object?", 3, 2],
    ["Objection!!!!", 3, 1],
    ["Una cosa material que se puede ver y tocar.", 3, 4]
]

Comments.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            commentsTestData.forEach((value) => {
                Comments.create({
                    comment: value[0],
                    forumId: value[1],
                    userId: value[2]
                })
            })
        }
    })

module.exports = Forum