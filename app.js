const express = require('express');
const app = express();

const path=require('path');
const cookies = require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const flash = require('connect-flash');
const session = require('express-session');
const detenv = require('dotenv');

detenv.config();
const PORT = process.env.PORT || 3000;


const db = require('./config/mongodb-config');

const userRouter = require('./routes/userRouter');
const vendorRouter = require('./routes/vendorRouter');
const indexRouter = require('./routes/indexRouter');
const productRouter = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');



app.set('view engine','ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(cookies());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use(flash());


app.use('/users',userRouter);
app.use('/vendors',vendorRouter);
app.use('/',indexRouter);
app.use('/products',productRouter);
app.use('/admin',adminRouter)


app.listen(3000,function(){
console.log('server is running on port 3000');
});


