const sequelize = require('sequelize');
const db = require('../config/DBConfig')

const User = db.define('user', {
    email: { type: sequelize.STRING, allowNull: false, validate: { isEmail: true } },
    verified: { type: sequelize.BOOLEAN, allowNull: false },
    username: { type: sequelize.STRING, allowNull: false },
    password: { type: sequelize.STRING, allowNull: false },
    fname: { type: sequelize.STRING(50), allowNull: false },
    lname: { type: sequelize.STRING(50), allowNull: false, },
    gender: { type: sequelize.STRING(1) },
    birthday: { type: sequelize.DATEONLY },
    country: { type: sequelize.STRING, allowNull: false },
    interest: { type: sequelize.STRING },
    status: { type: sequelize.STRING(300) },
    profilePicURL: { type: sequelize.STRING },
    role: { type: sequelize.STRING, allowNull: false },
    active: { type: sequelize.INTEGER(1), allowNull: false },
});

module.exports = User