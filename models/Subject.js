const sequelize = require('sequelize');
const db = require('../config/DBConfig')

const Subject = db.define('subject',
    {
        id:
        {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: { type: sequelize.STRING, allowNull: false },
        description: { type: sequelize.STRING(200) },
        active: { type: sequelize.TINYINT(1), defaultValue: 1 }
    },
    { timestamps: false },

);

Subject.sync();

subjectList = [
    {title:"Photography",description:""},
    {title:"Science",description:""},
    {title:"Programming",description:""},
    {title:"DIY",description:""},
    {title:"Productivity",description:""},
    {title:"Arts n' Craft",description:""},
    {title:"Mathematics",description:""},
    {title:"Language",description:""},
    {title:"Self Help",description:""}
];

Subject.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            subjectList.forEach(subject => {
                Subject.create(subject)    
            });
            
        }
    })

module.exports = Subject