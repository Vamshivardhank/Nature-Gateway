const Review=require('../models/reviews');
const Campground=require('../models/campground');

module.exports.createReview=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    });
    if(!campground){
        req.flash('error',`Cannot Write Review Campground is Deleted`);
        return res.redirect('/campgrounds');
    }
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created New Review');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteReview=async(req,res)=>{
    const { id,reviewId }=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{ $pull:{reviews:reviewId}});
    if(!campground){
        req.flash('error',`Campground is Already Deleted`);
        return res.redirect('/campgrounds');
    }
    const review=await Review.findByIdAndDelete(reviewId);
    req.flash('error','Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}