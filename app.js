if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}



const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const morgan=require('morgan');
const Campground=require('./models/campground');
const catchAsync=require('./helpers/catchAsync');
const ExpressError=require('./helpers/ExpressError');
const joi=require('joi');
const {campgroundschema,reviewschema}=require('./schemas');
const Review=require('./models/reviews');
const campgroundRoutes=require('./routes/campground');
const reviewsRouter=require('./routes/reviews');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStategy=require('passport-local');
const User=require('./models/user');
const registerRoute=require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');
const session=require('express-session'); 

const MongoDBStore=require('connect-mongo');


 const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Connected to Database");
})
.catch(err=>{
    console.log('error');
    console.log(err);
});

const store=MongoDBStore.create({
    mongoUrl:dbUrl,
    secret:"thisisnotgoodsecret",
    touchAfter:24*60*60

})

store.on('error',(e)=>{
    console.log('SESSION STORE ERROR');
})
const sessConfig={
    store,
    secret:"thisisnotgoodsecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() +1000*60*60*24*8,
        maxAge:1000*60*60*24*8
    }
};

app.use(session(sessConfig));
app.use(flash());
app.use(mongoSanitize());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.year=(new Date()).getFullYear() || 2022;
    next();
})


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


app.engine('ejs',ejsMate);



app.get('/',(req,res)=>{
    res.render('home.ejs');
});
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewsRouter);
app.use('/',registerRoute);

app.all('*',(req,res,next)=>{
    next(new ExpressError("Page Not Found",404));
})
app.use((err,req,res,next)=>{
    const { message="Something Went Wrong",statusCode=500}=err;
    res.status(statusCode).render('campgrounds/errors',{err});
})
const port=process.env.PORT ||3000;
app.listen(port,()=>{
    console.log("Listining on server 3000");
});

{/* <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Yelpcamp</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link " href="/">Home</a>
        <a class="nav-link" href="/campgrounds">Campgrounds</a>
        <a class="nav-link" href="/campgrounds/new">New Campground</a>
      </div>
 
    </div>
    <div class="navbar-nav  ml-auto">
      <% if(!currentUser){%>
        <a href="/register" class="nav-link ">Register</a>
        <a href="/login" class="nav-link ">Login</a>
      <% } else{%>
        <a href="/logout" class="nav-link ">Logout</a>
      <% }%>
    </div>
  </div>
</nav> */}