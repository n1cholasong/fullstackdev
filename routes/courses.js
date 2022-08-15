const express = require('express');
const router = express.Router();
const Course = require('../models/Courses');
const Quiz = require('../models/Quizes');
const Chapter = require('../models/chapter');
const Video = require('../models/video');
const Subject = require('../models/Subject');
const fs = require('fs');
const upload = require('../helpers/videoUpload');
const { Console } = require('console');
const User = require('../models/User');
const { ensureAuthenticated, authUser, authRole, authActive } = require("../helpers/auth");

async function videoSearch(cid) {

    var video = await Video.findAll({
        where: {
            ChapterId: cid
        },
        raw: true
    })

    return video[0];

}


router.get('/create', async function (req, res) {
    const subjects =  await Subject.findAll({raw:true,where:{active: 1}});

    res.render('./courses/createcourses',{subjects})
})

router.post('/create', ensureAuthenticated, authRole([1]),async function (req, res) {
    let Coursename = req.body.Coursename;
    let description = req.body.desc
    let content = req.body.content
    let uid = req.body.uid
    let picURL = req.body.pictureURL;
    let subjectId = req.body.Subjects;

    const subject = await Subject.findByPk(subjectId);

    await Course.create({
        courseName: Coursename, description: description, content: content, userId: uid,imgURL:picURL
    }).then(async (course) => {
        await course.addSubjects(subject,{through:"CourseSubjects"})
    })

    res.redirect('/course/view')
})

router.post('/Enroll/:cid',ensureAuthenticated,authActive, async function (req, res) {
    const user = await User.findByPk(req.user.id)
    const course = await Course.findByPk(req.params.cid)
    await course.addUsers(user, { through: 'UserCourses' })
    res.redirect('/');
})

router.get('/user/chapter/view/:id', ensureAuthenticated,authActive, async function (req, res) {
    var videos = [];
    var videoDict = {};
    const courseId = req.params.id;
    var chapters;

    Chapter.findAll({
        where: {
            CourseId: courseId
        },
        raw: true
    }).then(async (chapters) => {
        chapters = chapters
        await chapters.forEach(async (c) => {
            var vid = await videoSearch(c.id)
            if (vid != undefined && vid.videofile != "") {
                videos.push(vid)
                videoDict[vid.id] = c.id;

            }
        });
        //console.log(videos)
        res.render('./courses/viewchapateruser', { videos, chapters, videoDict })
    })
})

router.get('/Chapter/view/:cid', ensureAuthenticated, authRole([1]), (req, res) => {
    const cid = req.params.cid;
    Chapter.findAll({
        where: {
            CourseId: cid
        },
        raw: true
    }).then((chapters) => {
        //console.log(chapters)
        res.render('./courses/viewchapter', { chapters, cid: cid })
    })


})

router.post('/Chapter/view/:cid', ensureAuthenticated, authRole([1]), (req, res) => {
    const cid = req.body.cid;
    var chapterNum = req.body.chapterNum;
    //console.log(cid)
    if (chapterNum == "None") {
        Chapter.create({
            ChapterNum: 1,
            CourseId: cid
        })
    }
    else {
        chapterNum = parseInt(chapterNum)
        chapterNum += 1

        Chapter.create({
            ChapterNum: chapterNum,
            CourseId: cid
        })
    }

    Chapter.findAll({
        where: {
            CourseId: cid
        },
        raw: true
    }).then((chapters) => {
        res.redirect('/Course/Chapter/view/' + cid)
    })

})

router.get('/quiz/create/:cid', ensureAuthenticated, authRole([1]), (req, res) => {
    const cid = req.body.cid;
    res.render('./courses/createquiz', { cid })
})


router.post('/Chapter/delete/:cid', ensureAuthenticated, authRole([1]), (req, res) => {
    const chpaterId = req.params.cid;
    //console.log(chpaterId)
    Chapter.destroy({ where: { id: chpaterId } })
    res.redirect(req.get('referer') )
})

router.get('/user/video/view/:vid', async function (req, res) {
    const vid = req.params.vid;
    var filePath = '';
    console.log("Hellio video is being stramed")
    await Video.findByPk(vid).then((video) => {
        filePath = './public' + video.videofile;
    })

    try {
        const stat = await fs.statSync(filePath)
        const fileSize = stat.size
        const range = req.headers.range

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            var start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1
            const chunksize = (end - start) + 1
            start = start >= end ? 0 : start;
            const file = fs.createReadStream(filePath, { start, end })
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            await fs.createReadStream(filePath).pipe(res)
        }
    } catch (err) {
        console.log(err)
    }

})

router.get('/video/upload/:chapterid', ensureAuthenticated, authRole([1]), async function (req, res) {
    // Creates user id directory for upload if not exist
    //cid here means chpater id
    const cid = req.params.chapterid;
    const video = await videoSearch(cid);
    res.render('./courses/uploadvideo', { video })
});

router.post('/video/upload/:chapterid', async function (req, res) {
    // Creates user id directory for upload if not exist
    const cid = req.params.chapterid;
    const filename = req.body.VideoUpload;
    const fileUrl = req.body.videoURL;

    const video = await videoSearch(cid);
    console.log(video)

    if (video == undefined) {
        Video.create({
            videoname: filename,
            videofile: fileUrl,
            ChapterId: cid
        })

        Chapter.findByPk(cid).then((chpater) => {
            res.redirect('/Course/Chapter/view/' + chpater.CourseId);
        })
    }
    else {
        await Video.update({
            videoname: filename,
            videofile: fileUrl,
            ChapterId: cid
        }, { where: { id: video.id } })

        Chapter.findByPk(cid).then((chpater) => {
            res.redirect('/Course/Chapter/view/' + chpater.CourseId);
        })
    }

});


router.post('/upload', ensureAuthenticated, authRole([1]), (req, res) => {
    // Creates user id directory for upload if not exist
    //console.log(req.user.id)
    if (!fs.existsSync('./public/uploads/Video' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            res.json({
                file: `/uploads/${req.user.id}/${req.file.filename}`
            });
        }
    });
});

router.get('/quiz/edit/:cid', ensureAuthenticated, authRole([1]), (req, res) => {
    const cid = req.params.cid;
    Quiz.findAll({
        where: {
            ChapterId: cid
        }
    }).then((Quizes) => {
        res.render('./courses/editQuiz', { Quizes,cid })
    })
})

router.post('/quiz/edit/:cid', ensureAuthenticated, authRole([1]), async function (req, res) {
    const cid = req.params.cid;
    const body = req.body;
    var cansList = [];
    var count = 0;

    for (var [field, value] of Object.entries(body)) {
        if (field.includes("cans")) {
            if (value == "1") {
                cansList.push(body.ans1[count])
            } else if (value == "2") {
                cansList.push(body.ans2[count])
            }
            else if (value == "3") {
                cansList.push(body.ans3[count])
            }
            else if (value == "4") {
                cansList.push(body.ans4[count])
            }
            count++;
        }
    }



    for (var i = 0; i < body.qId.length; i++) {

        await Quiz.update({
            question: body.question[i],
            description: body.description[i],
            a1: body.ans1[i],
            a2: body.ans2[i],
            a3: body.ans3[i],
            a4: body.ans4[i],
            correctans: cansList[i],
            ChapterId: cid
        },
            { where: { id: parseInt(body.qId[i]) } })
            .then((quiz) => {
                console.log("CHanged:", quiz)
            })
    }
    const chapter = await Chapter.findByPk(cid)

    res.redirect('/Course/Chapter/view/' + chapter.CourseId)
})

router.post('/Quiz/Delete/:qid', ensureAuthenticated, authRole([1]), (req, res) => {
    const qid = req.params.qid;
    Quiz.destroy({ where: { id: qid } })
        .then(() => {
            res.redirect(req.get('referer'));
        })
})


router.get('/quiz/view/:cid', ensureAuthenticated, (req, res) => {
    const cid = req.params.cid;
    Quiz.findAll({
        where: {
            ChapterId: cid
        }
    }).then(async (Quizes) => {
        const course = await Chapter.findByPk(cid,{raw:true});
        res.render('./courses/viewQuiz', { Quizes ,courseID:course.CourseId})
    })
})

router.post('/quiz/view/:cid', ensureAuthenticated, (req, res) => {
    const cid = req.params.cid;
    const form = req.body;
    var points = 0
    Quiz.findAll({
        where: {
            ChapterId: cid
        }, raw: true
    }).then((Quizes) => {

        for (var i = 0; i < Quizes.length; i++) {
            // console.log(Quizes[i].correctans == form["anwser"+i])
            if (Quizes[i].correctans == form["anwser" + i]) {
                points += 1
                //console.log(points)
            }
        }

        res.render('./courses/result', { points: points, maxpoint: Quizes.length })
    })
})


router.post('/quiz/create/:cid', ensureAuthenticated, authRole([1]), async function (req, res) {
    let cid = req.params.cid;
    let question = req.body.question;
    let description = req.body.description;
    let ans1 = req.body.ans1;
    let ans2 = req.body.ans2;
    let ans3 = req.body.ans3;
    let ans4 = req.body.ans4;
    let correctans = req.body.cans;

    if (correctans == "1") {
        correctans = ans1
    }
    else if (correctans == "2") {
        correctans = ans2
    }
    else if (correctans == "3") {
        correctans = ans3
    }
    else {
        correctans = ans4
    }

    await Quiz.create({
        question: question, description: description, a1: ans1, a2: ans2, a3: ans3, a4: ans4, correctans: correctans, ChapterId: cid
    })


    res.redirect('/course/quiz/edit/' + cid)
})



router.get('/view', ensureAuthenticated, authRole([1]), (req, res) => {
    Course.findAll({
        raw: true
    }).then((Courses) => {
        res.render('./courses/viewcourses', { Courses })
    })
        .catch(err => console.log(err));
})

router.get('/update/:id', ensureAuthenticated, authRole([1]), async function (req, res) {
    const subjects = await Subject.findAll({raw:true,where:{active: 1}})

    Course.findByPk(req.params.id,{include:"subjects",raw:true}).then((course) => {
        const sid = course['subjects.id']
        res.render('./courses/updatecourse', { course,subjects,sid })
    })
})

router.post('/update/:id', ensureAuthenticated, authRole([1]), (req, res) => {
    let Coursename = req.body.Coursename;
    let description = req.body.desc
    let content = req.body.content
    let price = req.body.Price
    let uid = req.body.uid
    let imgURL = req.body.pictureURL;
    let subjectId = req.body.Subjects;

    Course.update({
        courseName: Coursename, description: description, content: content, price: price, userId: uid,imgURL:imgURL
    },
        { where: { id: req.params.id } }
    ).then(async (result) => {
        const subject = await Subject.findByPk(subjectId);

        await Course.findByPk(req.params.id).then((course)=>{
            course.setSubjects(subject)
        });
        console.log(result + ' course updated');
        res.redirect('/course/view')
    }).catch(err => console.log(err));
})


router.post('/delete/:id', ensureAuthenticated, authRole([1]), async function (req, res) {
    try {
        let course = await Course.findByPk(req.params.id)
        if (!course) {
            res.redirect('/course/view')
            return "Hahaha didn't work";
        }


        Course.destroy({ where: { id: req.params.id } })
        res.redirect('/course/view')
    }
    catch (err) {

    }
})

module.exports = router