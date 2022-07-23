const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const User = db.define('user', {
    email: { type: Seqelize.STRING },
    username: { type: Seqelize.STRING },
    password: { type: Seqelize.STRING },
    fname: { type: Seqelize.STRING },
    lname: { type: Seqelize.STRING },
    gender: { type: Seqelize.STRING },
    birthday: {type: Seqelize.DATEONLY},
    country: { type: Seqelize.STRING },
    interest: { type: Seqelize.STRING },
    status: {type: Seqelize.STRING(300)},
    role: { type: Seqelize.STRING }
});

module.exports = User