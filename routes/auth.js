const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const {signup,signout,signin,isSignedIn} = require('../controllers/auth')

router.post("/signup",[
    check("name","name should be atleast 3 char").isLength({min:3}),
    check("email","check the eamil entered").isEmail(),
    check("password","password should be atleast 3 char").isLength({min:3})
],signup)

router.post("/signin",[
    check("email","check the eamil entered").isEmail(),
    check("password","check the password entered").isLength({min:3})
],signin)

router.get("/signout",signout)


module.exports = router