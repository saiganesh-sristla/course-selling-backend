const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, Course} = require("../db/index");
const {jwtSecret} = require('../config.js');
const jwt = require('jsonwebtoken');

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username: username,
        password: password
    })

    res.json({
        message: 'Admin created successfully'
    })
});

router.post('/signin',async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const admin = await Admin.findOne({
        username,
    })
    if(admin){
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

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    // zod
    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({});

    res.json({
        courses: response
    })

});

module.exports = router;