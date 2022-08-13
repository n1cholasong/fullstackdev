const sequelize = require('sequelize');
const db = require('../config/DBConfig')
const Role = require('./Role')

const User = db.define('user', {
    email: { type: sequelize.STRING, allowNull: false, validate: { isEmail: true } },
    verified: { type: sequelize.TINYINT(1), allowNull: false },
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
    active: { type: sequelize.TINYINT(1), allowNull: false },
    logonAt: { type: sequelize.DATE }
});

User.sync();
Role.sync();

roleTypes = ["ADMIN", "STUDENT", "TUTOR"];

Role.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            roleTypes.forEach((role, index) => {
                Role.create({
                    id: index + 1,
                    title: role
                })
            });
        };
    });

adminAcc =
    [
        ['nicholasong75@gmail.com', 1, 'n1cholas.ong', '$2a$10$sUm1yYEeoTRYxTEDyxqVFuaETT4mMBk0vYgPgrJrgVQ98YRP9NBRm', 'Nicholas', 'Ong', 'M', null, 'SG', 'productivity,artsncrafts,langauge', null, null, 1, 1],
        ['Nat@gmail.com', 1, 'nat', '$2a$10$kFXNArrd0alYlG/zCzGfz./0m86G4Amgdub6656CHR4i.Aysc8NUi', 'Nat', 'Lee', 'M', '1995-09-30', 'US', 'photography,productivity,langauge', null, null, 1, 1],
        ['lucaslee@gmail.com', 1, 'Xepvoid', '$2a$10$6fwMyC0jwW34PznlgWM8wOoyx1ritkY38XnklD4g4QLLyxoErxiyy', 'Lucas', 'Lee', 'M', '2004-01-17', 'SG', 'programming,productivity,selfhelp', null, null, 1, 1],
        ['Kiat0878@gmail.com', 1, 'Kiat10', '$2a$10$jCtrCrWCNFhXI9kpEOgEeeTHxJi5yLFO2Bfkg.fZ2bJ2rx1qOD6mS', 'Kai Kiat', 'Lo', null, '2002-01-31', 'AT', 'programming,productivity,langauge,selfhelp', null, null, 1, 1],
        ['johnsmith123@curodemy.com', 1, 'johnsmith23', '$2a$10$MSYP/5u38iPwbk9gqyeuAeoN7cDzQwy32x9paLMu13l1fiewJ5hhS', 'John', 'Smith', '', null, '', null, null, null, 1, 2]
    ];

User.findAndCountAll()
    .then(result => {
        if (result.count < 1) {
            adminAcc.forEach((value) => {
                User.create({
                    email: value[0],
                    verified: value[1],
                    username: value[2],
                    password: value[3],
                    fname: value[4],
                    lname: value[5],
                    gender: value[6],
                    birthday: value[7],
                    country: value[8],
                    interest: value[9],
                    status: value[10],
                    profilePicURL: value[11],
                    active: value[12],
                    roleId: value[13]
                })
            });
        };
    });

module.exports = User