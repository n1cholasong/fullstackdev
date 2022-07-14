const express = require('express');
const router = express.Router();
const Course = require('../models/Courses')
const Quiz = require('../models/Quizes')

router.get('/create',(req,res)=>{
    res.render('./courses/createcourses')
})

router.get('/quiz/create/:cid',(req,res)=>{
    const cid = req.body.cid;
    res.render('./courses/createquiz',{cid})
})


router.post('/quiz/create/:cid',(req,res)=>{
    let cid = req.params.cid;
    let question =  req.body.question;
    let description = req.body.description;
    let ans1 = req.body.ans1;
    let ans2 = req.body.ans2;
    let ans3 = req.body.ans3;
    let ans4 = req.body.ans4;
    let correctans = req.body.cans



    Quiz.create({
        question:question,description:description,a1:ans1,a2:ans2,a3:ans3,a4:ans4,correctans:correctans,CourseId:cid
    })

    res.redirect('/course/view')
})

router.post('/create',(req,res)=>{
    let Coursename = req.body.Coursename;
    let description = req.body.desc
    let content = req.body.content
    let price = req.body.Price
    let uid = req.body.uid

    Course.create({
        courseName:Coursename,description:description,content:content,price:price,userId:uid
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