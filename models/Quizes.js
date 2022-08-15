const Seqelize = require('sequelize');
const db = require('../config/DBConfig');
const Chapter = require('./chapter');

async function findChapterId(){
   return await Chapter.findAll({raw:true}).then((chapter) => {return chapter})
}

const Quizes = db.define('Quizes', {
    question: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    a1: { type: Seqelize.STRING},
    a2:  {type: Seqelize.STRING},
    a3: { type: Seqelize.STRING},
    a4: { type: Seqelize.STRING},
    correctans: { type: Seqelize.STRING}
});

Quizes.sync();
Chapter.sync();


Quizes.findAndCountAll()
.then(async function(result) {
    try{
    if (result.count < 1) {
        
        await Quizes.create({
            question: "What is python",
            description: "fist question",
            a1: "A progmaming laungague",
            a2: "A Type of Snake",
            a3: "Anaconda?",
            a4: "I don't know",
            correctans: "A progmaming laungague",
            ChapterId: 1
        })
        
    };
    }
    catch(err){
       console.log(err)
    }
});

module.exports = Quizes