const User = require('../models/user')
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expresJwt = require('express-jwt');


exports.signup = (req,res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
       return res.status(422).json({
           msg: errors.array()[0].msg
       })
   }
   

   const user = new User(req.body)
   user.save((err,user) => {
       if(err){
        return   res.status(400).json(err)
       }
       res.json({
           name: user.name,
           email:user.email,
           id: user._id
       })
   })
}

exports.signin = (req,res) => {
    const {email,password}= req.body
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            msg: errors.array()[0].msg
        })
    }

    User.findOne({email},(err,user)=>{
        if(err || !user ){
           return  res.status(400).json({msg:"email doesnot exist"})
        }
        if(!user.authenticate(password)){
           return res.status(401).json({msg:"mail and password doesnot match"})
        }

        const token = jwt.sign({_id:user._id},process.env.SECRET)
        res.cookie("token",token,{expire: new Date()+9999})
        const {_id,name,email,role} = user
        res.json({token,user:{_id,name,email,role}}) 
    })

    
}

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.send("signout page")
}

exports.isSignedIn = expresJwt({
    secret: process.env.SECRET,
    userProperty:"auth"
})

exports.isAuthenticated= (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker)
    {
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin= (req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({
            error : "NOT AN ADMIN:ACCESS DENIED"
        })
    }
    next()
}