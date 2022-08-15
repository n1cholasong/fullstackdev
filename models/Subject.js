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
        active: { type: sequelize.TINYINT(1), defaultValue: 1 }
    },
    { timestamps: false },

);


module.exports = Subject