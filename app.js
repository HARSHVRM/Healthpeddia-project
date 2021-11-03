/* if(process.env.NODE_ENV !== "production")
{ */
    require('dotenv').config();


const express=require("express");
const path=require('path');
const {v4:uuid}=require('uuid');
const mongoose=require('mongoose');
const ejsmate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport'); 
const LocalStrategy=require('passport-local');

const ExpressError=require('./utils/ExpressError');
const catchAsync=require('./utils/catchAsync');
const methodOverride=require("method-override");
const users=require('./models/users');
const reviews=require('./models/reviews');
const User=require('./models/loginuser');

//mongodb+srv://OUR-FIRST-USER:<password>@cluster0.gx0v5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const description=require('./seeds/description');
const { string } = require("joi");
const Joi = require("joi");

const comments=require('./Routes/comments')
const review=require('./Routes/reviews')
const main=require('./Routes/main')
const Diet=require('./Routes/Diet')
const excercise=require('./Routes/excercise')
const nutritionFacts=require('./Routes/nutritionFacts')
const userRoutes=require('./routes/loginusers')
const MongoDBStore = require("connect-mongo")(session);

const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/fitness';

mongoose.connect(dbUrl,{useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology:true, useFindAndModify: false})


const app=express();
app.engine('ejs', ejsmate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'./public')))
app.use('/images',express.static('./images'))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});


store.on("error", function (e){
  console.log("session store error",e)
}) 

const sessionConfig={
  store,
  name:'session',
  secret,
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,   //1000ms * 60 sec *60 min * 24 hrs in a day * for 7
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig))
app.use(flash());
         

app.use(passport.initialize());      
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());       
passport.deserializeUser(User.deserializeUser());    

app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser=req.loginuser        
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use('/',userRoutes)
app.use('/comments',comments)

app.get('/', (req,res)=>{
  res.render('fitness')
})


app.use('/main', main);
app.use('/excercise',excercise);
app.use('/Diet', Diet);
app.use('/nutritionFacts', nutritionFacts)
app.use('/review' , review)

app.get('/login',async(req,res)=>{
  res.render('login')
})


app.all('*',(req,res,next)=>{                        //Went to something that does not exist on the website then we do this.
  next(new ExpressError('Page not found', 404))
});

app.use((err,req,res,next)=>{ 
  const {statusCode=404}=err;  
  if(!err.message) err.message="Something went wrong";      //error handler.
  res.status(statusCode).render('error',{err});                     
})

const port=process.env.PORT || 5000 ;
app.listen(port,()=>{
    console.log(`server started on ${port}`);
})

