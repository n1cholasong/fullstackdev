const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const User = db.define('user', {
    email: {
        type: Seqelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    username: {
        type: Seqelize.STRING,
        allowNull: false,
    },
    password: {
        type: Seqelize.STRING,
        allowNull: false,
        unique: true,
    },
    fname: {
        type: Seqelize.STRING(50),
        allowNull: false,
    },
    lname: {
        type: Seqelize.STRING(50),
        allowNull: false,
    },
    gender: { type: Seqelize.STRING(1) },
    birthday: { type: Seqelize.DATEONLY },
    country: {
        type: Seqelize.STRING,
        allowNull: false
    },
    interest: { type: Seqelize.STRING },
    status: { type: Seqelize.STRING(300) },
    profilePicURL: { type: Seqelize.STRING },
    role: {
        type: Seqelize.STRING,
        allowNull: false
    },
    active: {
        type: Seqelize.INTEGER(1),
        allowNull: false,
    },
});

module.exports = User