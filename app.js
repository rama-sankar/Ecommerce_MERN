require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = 8000

const authRoutes = require("./routes/auth")
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

//DB CONNECTION 
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
    
}).then(console.log("DB CONNECTED"));

//MIDDLEWARES
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)


//SEVER CONNECTION
app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})


