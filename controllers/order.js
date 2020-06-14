const {Order,ProductCart} = require("../models/order")


exports.getOrderById = (req,res,next,id) => {
    Order
    .populate("products.product","name price")
    .findById(id).exec((err,order)=>{
        if(err){
            res.status(400).json({err : "no order found"})
        }
        req.order = order
        next()
    })

}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err,order)=>{
        if(err){
            res.status(400).json({err : "order creation failed"})
        }
        res.json(order)
    })
}

exports.getAllOrders = (req,res) => {
    Order.find()
    .populate("user","_id name")
    .exec((err,orders) => {
        if(err){
            res.status(400).json({err : "no order found"})
        }
        res.json(orders)
    })
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) => {
    Order.update(
        {_id:req.body.orderId},
        {$set : {status : req.body.status}},
        (err,order) => {
            if(err){
                res.status(400).json({err:"cannot update order status"})
            }
            res.json(order)
        }
    )
}
