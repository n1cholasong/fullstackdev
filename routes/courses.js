const express = require('express');
const router = express.Router();
const Course = require('../models/Courses');
const Quiz = require('../models/Quizes');
const Chapter = require('../models/chapter');
const Video = require('../models/video');
const fs = require('fs');
const upload = require('../helpers/videoUpload');

router.get('/create',(req,res)=>{
    res.render('./courses/createcourses')
})

router.get('/Chapter/view/:cid',(req,res)=>{
    const cid = req.params.cid;
    Chapter.findAll({
        where: {
            CourseId: cid
        },
        raw:true
    }).then((chapters)=>
    {
        console.log(chapters)
        res.render('./courses/viewchapter',{chapters,cid:cid})
    })


})

router.post('/Chapter/view/:cid',(req,res)=>{
    const cid = req.body.cid;
    var chapterNum = req.body.chapterNum ;
    console.log(cid)
    if(chapterNum == "None")
    {
        Chapter.create({
            ChapterNum:1,
            CourseId:cid 
        })
    }
    else
    {
        chapterNum = parseInt(chapterNum)
        chapterNum += 1

        Chapter.create({
            ChapterNum:chapterNum,
            CourseId:cid 
        })
    }

    Chapter.findAll({
        where: {
            CourseId: cid
        },
        raw:true
    }).then((chapters)=>
    {
        res.redirect('/Course/Chapter/view/'+cid)
    })

})

router.get('/quiz/create/:cid',(req,res)=>{
    const cid = req.body.cid;
    res.render('./courses/createquiz',{cid})
})


router.get('/user/chapter/view/:cid',async function(req,res){
    const cid = req.params.cid;
    var filePath = '';

    await Chapter.findAll({
        where: {
        CourseId: cid
      },raw:true}).then(async (Chapter)=>{
        // if(Chapter.length > 1){
        //     Chapter = Chapter[0]
        // }
        await Video.findAll({
            where: {
            ChapterId: Chapter[0].id
          },raw:true}).then((video)=>{
            filePath = './public' + video[0].videofile
          })

      })
    

    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(filePath, {start, end})
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
        fs.createReadStream(filePath).pipe(res)
      }

      res.render('./courses/viewVideoUser',{videoURL:'/user/chapter/view/' + cid})

})

router.get('/video/upload/:cid', (req, res) => {
    // Creates user id directory for upload if not exist
    const cid = req.params.cid;

    res.render('./courses/uploadvideo')
});

router.post('/video/upload/:cid', (req, res) => {
    // Creates user id directory for upload if not exist
    const cid = req.params.cid;
    const filename = req.body.VideoUpload;
    const fileUrl = req.body.videoURL;
    Video.create({
        videoname:filename,
        videofile:fileUrl,
        ChapterId:cid
    })

    Chapter.findByPk(cid).then((chpater) => 
    {
        res.redirect('/Course/Chapter/view/' + chpater.CourseId);
    })

    
});


router.post('/upload', (req, res) => {
    // Creates user id directory for upload if not exist
    console.log(req.user.id)
    if (!fs.existsSync('./public/uploads/Video' + req.user.id )) {
        fs.mkdirSync('./public/uploads/' + req.user.id , {
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

router.get('/quiz/view/:cid',(req,res)=>{
    const cid = req.params.cid;
    Quiz.findAll({
        where: {
            ChapterId: cid
          }
    }).then((Quizes) => {
        res.render('./courses/viewQuiz',{Quizes})
    })
})

router.post('/quiz/view/:cid',(req,res)=>{
    const cid = req.params.cid;
    const form = req.body;
    var points = 0
    Quiz.findAll({
        where: {
            ChapterId: cid
          },raw: true
    }).then((Quizes) => {

        for(var i = 0;i < Quizes.length;i++)
        {
            // console.log(Quizes[i].correctans == form["anwser"+i])
            if(Quizes[i].correctans == form["anwser"+i])
            {
                points += 1
                //console.log(points)
            }
        }

        res.render('./courses/result',{points:points,maxpoint:Quizes.length})
    })
})


router.post('/quiz/create/:cid',(req,res)=>{
    let cid = req.params.cid;
    let question =  req.body.question;
    let description = req.body.description;
    let ans1 = req.body.ans1;
    let ans2 = req.body.ans2;
    let ans3 = req.body.ans3;
    let ans4 = req.body.ans4;
    let correctans = req.body.cans;

    if (correctans == "1")
    {
        correctans = ans1
    }
    else if(correctans == "2")
    {
        correctans = ans2
    }
    else if(correctans == "3")
    {
        correctans = ans3
    }
    else
    {
        correctans = ans4
    }

    Quiz.create({
        question:question,description:description,a1:ans1,a2:ans2,a3:ans3,a4:ans4,correctans:correctans,ChapterId:cid
    })

    res.redirect('/course/view')
})

router.post('/create',(req,res)=>{
    let Coursename = req.body.Coursename;
    let description = req.body.desc
    let content = req.body.content
    let uid = req.body.uid

    Course.create({
        courseName:Coursename,description:description,content:content,userId:uid
    })
    res.redirect('/course/view')
})

router.get('/view',(req,res)=>{
    Course.findAll({
        raw:true
    }).then((Courses) => { 
        res.render('./courses/viewcourses',{Courses})
    })
    .catch(err => console.log(err));
})

router.get('/update/:id',(req,res) =>{
    Course.findByPk(req.params.id).then((course)=>{
        res.render('./courses/updatecourse',{course})
    })
})

router.post('/update/:id',(req,res) =>{
    let Coursename = req.body.Coursename;
    let description = req.body.desc
    let content = req.body.content
    let price = req.body.Price
    let uid = req.body.uid

    Course.update({
        courseName:Coursename,description:description,content:content,price:price,userId:uid
    },
    {where:{id:req.params.id}}
    ).then((result)=>{
        console.log(result[0] + ' course updated');
        res.redirect('/course/view')
    }).catch(err => console.log(err));
})


router.post('/delete/:id',async function (req,res) {
    try{
        let course = await Course.findByPk(req.params.id)
        if (!course){
            res.redirect('/course/view')
            return "Hahaha didn't work";
        }
    
    
        Course.destroy({where : {id: req.params.id} })
        res.redirect('/course/view')
        }
        catch(err){
    
        }
})

module.exports = router