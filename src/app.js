const express= require('express');
const app= express();
const userRoutes= require('./routes/userRoutes/user.routes');
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/auth',userRoutes)

module.exports= app;


