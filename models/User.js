const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const User = db.define('user',{
    name:{type:Seqelize.STRING}
});

module.exports = User