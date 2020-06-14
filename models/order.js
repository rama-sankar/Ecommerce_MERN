const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const ProductCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name: String,
    count: Number,
    Price: Number
})

const ProductCart = mongoose.model("ProductCart",ProductCartSchema)

const orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id : {},
    amount: Number,
    address : String,
    updated: Date,
    status:{
        type:String,
        default: "Received",
        enum : ["Received","Processing","Shipped" ,"Delivered", "Cancelled"],
    },
    user:{
        type: ObjectId,
        ref:"User"
    }

},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)

module.exports = {Order,ProductCart}