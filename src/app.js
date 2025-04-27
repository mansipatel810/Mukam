const express= require('express');
const app= express();
const userRoutes= require('./routes/userRoutes/user.routes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(morgan("tiny"));

app.use('/api/auth',userRoutes)

module.exports= app;


