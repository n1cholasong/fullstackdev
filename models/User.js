const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const User = db.define('user', {
    email: { type: Seqelize.STRING },
    username: { type: Seqelize.STRING },
    password: { type: Seqelize.STRING },
    role: { type: Seqelize.STRING }
});

module.exports = User