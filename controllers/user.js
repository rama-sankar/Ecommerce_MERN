const User = require("../models/user")
const Order = require("../models/order")

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user)=> {
        if(err || !user){
            return res.status(400).json({err:"user not found"})
        }
        req.profile = user
        next() 
    })
   
}

exports.getUser =  (req,res) => {
    req.profile.salt = undefined
    req.profile._id = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user) => {
            if(err){
                res.status(400).json({err : "not able to update user"})
            }
            user.salt = undefined
            user._id = undefined
            user.encry_password = undefined
           // user.createdAt = undefined
            user.updatedAt = undefined
         res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res) => {
    Order.find({user : req.profile._id})
    .populate("user","name _id")
    .exec((err,order) => {
        if(err || !order){
            res.status(400).json({err : "no order found"})
        }
        res.json(order)
    })

}

exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = []
    req.body.order.products.array.forEach(product => {
        purchases.push({
            _id:product._id,
            name: product.name,
            description:product.description,
            category:product.category,
            quantity: product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })

    //store in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push : {purchases:purchases}},
        {new:true},
        (err,purchases) => {
            if(err){
                res.status(400).json({err : "unsable to save purchaselist"})
            }
            next()
        }
    )
    });

}