const Category = require("../models/category")

exports.findCategoryById  = (req,res,next,id) => {
 Category.findById(id).exec((err,cate)=>{
     if(err || !cate){
        return  res.json(400).json({err : "category not found" })
     }
     req.category = cate
     next()
 })
}

exports.createCategory = (req,res) => {
    const category = new Category(req.body)
    category.save((err,category)=>{
        if(err){
            return res.json(400).json({err : "cant save category in db" })
        }
        res.json(category)
    })
    
}

exports.getCategory = (req,res) => {
     return  res.json(req.category)
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,items)=>{
        if(err){
           return  res.json(400).json({err : "no categories found" })
        }
        res.json(items)  
    })
}

exports.updateCategory = (req,res) => {
    category = req.category
    category.name = req.body.name
    category.save((err,updatedcategory)=>{
        if(err|| !updatedcategory){
            return    res.status(400).json({err : "not able to update the category"})
        }
        res.json(updatedcategory)
    })
}

exports.removeCategory = (req,res) => {
    category = req.category
    category.remove((err,category)=>{
        if(err|| !category){
            return    res.status(400).json({err : "not able to delete the category"})
        }
        res.json({message : "successfully deleted"})
    })
}