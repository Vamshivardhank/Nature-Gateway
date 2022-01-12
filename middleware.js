const catchAsync=require('./helpers/catchAsync');
const Campground=require('./models/campground');
const {campgroundschema,reviewschema}=require('./schemas')
const ExpressError=require('./helpers/ExpressError');
const Review=require('./models/reviews');
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','You must be signed in first');
         return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=catchAsync(async (req,res,next)=>{  
    const {id}=req.params;
    console.log(id);
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id) ){
        req.flash('error',"You Don't Have Permisson to Access");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
});
module.exports.isReviewAuthor=catchAsync(async (req,res,next)=>{  
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id) ){
        req.flash('error',"You Don't Have Permisson to Access");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
});
module.exports.validateCampground= (req,res,next)=>{
    const {error}=campgroundschema.validate(req.body);
    if(error){ 
        console.log(error);
        throw new ExpressError(error,404);
    } else next();
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewschema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(error,400);
    }else next();
}
