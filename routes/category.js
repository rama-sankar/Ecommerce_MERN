const express = require("express")
const router = express.Router()

const {findCategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory} = 
                                                                               require("../controllers/category")
const {getUserById} = require("../controllers/user")
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")

// params 
router.param('userId',getUserById)
router.param("categoryId",findCategoryById)

//routes
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)
router.get("/category/:categoryId",getCategory) 
router.get("/categories",getAllCategory)
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory)



module.exports = router