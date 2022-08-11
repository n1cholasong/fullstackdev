const sequelize = require('sequelize');
const db = require('../config/DBConfig')

const Role = db.define('role',
    {
        id:
        {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: { type: sequelize.STRING }
    },
    { timestamps: false },

);


module.exports = Role