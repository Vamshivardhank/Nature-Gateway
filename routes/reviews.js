
const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../helpers/catchAsync');
const Review=require('../models/reviews');
const reviews=require('../controllers/reviews');
const Campground=require('../models/campground');
const ExpressError=require('../helpers/ExpressError');
const {campgroundschema,reviewschema}=require('../schemas');
const {isLoggedIn,validateReview,isAuthor, isReviewAuthor}=require('../middleware');


router.post('',isLoggedIn,validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId',isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports=router;