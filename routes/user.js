const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Admin, Course } = require("../db");
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config.js');

// User Routes
router.post('/signup',async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username: username,
        password: password
    })

    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin',async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
        username,
    })
    if(user){
        const token = jwt.sign({username:username}, jwtSecret);
        res.json({
            "token":token
        })
    }else{
        res.json({
            "message":"username or password is incorrect"
        })
    }
});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({});

    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;

    const user = await User.updateOne({
        username
    },{
        "$push":{
            purchasedcourses:courseId
        }
    })
    res.json({
        'message':"course purchased successfully"
    })
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;
    
    const user = await User.findOne({
        username
    })

    const courses = await Course.find({
        _id:{
            "$in":user.purchasedcourses
        }
    })
    res.json({
        "courses":courses
    })
});

module.exports = router