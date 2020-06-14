const Product = require('../models/product')
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById= (req,res,next,id) => {
  Product
  .populate('category')
  .findById(id).exec((err,Product)=>{
      if(err || !product){
          return res.status(400).json({err : "no product found"})
      }
      req.product = product
      next()
  })
}

exports.createProduct = (req,res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions= true;
    
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({err:"problem with image"})
        }

        const {name,description,price,category,stock} = fields
        
        if(!name || !description || !price || !category || !stock){
            res.status(400).json({err : "please include all fields"}) 
        }

        let product = new Product(fields)
        //handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                res.status(400).json({err : "file size is too big"}) 
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to db
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({err:"saving product failed"})
            } 
            res.json(product)
        })
    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined
    res.send(req.product)
}


//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        res.send(req.product.photo.data)
    }
    next()
}

exports.deleteProduct = (req,res) => {
    const product = req.product
    product.remove((err,product)=>{
        if(err)
        {
            return res.status(400).json({err : "deletion unsuccessful"})

        }
        req.json({msg : "deletion Successful"})
    })
}

exports.updateProduct = (req,res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions= true;
    
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({err:"problem with image"})
        }

       
        let product = req.product
        product = _.extend(product,fields)

        //handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                res.status(400).json({err : "file size is too big"}) 
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to db
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({err:"updating product failed"})
            } 
            res.json({msg : "updation successful"})
        })
    })

}

exports.getAllProducts = (req,res) => {
    const limit = req.query.limit ?  parseInt(req.query.limit) : 8
    const sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return    res.status(400).json({err : "no product found"})
        }
        res.json(products)
    })
}

exports.getAllUniqueCategories =( req,res )=> {
    Product.distinct("category",{},(err,category) =>{
        if(err || !category){
            return res.status(400).json({err : "no category found"})
        }
        res.json(category)
    })
}

exports.updateStock = (req,res) => {
    const myoperations = req.body.order.products.map(prod => {
        return{
            filter : {_id : prod._id},
            update : {$inc : {stock : -prod.count ,sold : +prod.count}}
        }
    }) 

    Product.bulkWrite(myoperations,{},(err,products)=>{
        if(err){
            res.status(400).json({err : "bulk operation failed"})
        }
    })
}