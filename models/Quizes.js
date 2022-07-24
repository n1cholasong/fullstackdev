const Seqelize = require('sequelize');
const db = require('../config/DBConfig');

const Quizes = db.define('Quizes', {
    question: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    a1: { type: Seqelize.STRING},
    a2:  {type: Seqelize.STRING},
    a3: { type: Seqelize.STRING},
    a4: { type: Seqelize.STRING},
    correctans: { type: Seqelize.STRING}
});

module.exports = Quizes