const express= require('express');
const app= express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const userRoutes= require('./routes/userRoutes/user.routes');
const propertyRoutes= require('./routes/propertyRoutes/property.routes');


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(morgan("tiny"));

app.use('/api/auth',userRoutes)
app.use('/api/property',propertyRoutes)


module.exports= app;


