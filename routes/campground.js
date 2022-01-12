const express=require('express');
const router=express.Router();
const catchAsync=require('../helpers/catchAsync');
const Campground=require('../models/campground');
const campgrounds=require('../controllers/campground');
const ExpressError=require('../helpers/ExpressError');
const {campgroundschema,reviewschema}=require('../schemas');
const { isLoggedIn,isAuthor,validateCampground}=require('../middleware');
const multer=require('multer');
const {storage}=require('../cloudinary/index');
const upload=multer({storage});



router.get('/',catchAsync(campgrounds.index));

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.post('/',upload.array('images'),validateCampground,catchAsync(campgrounds.createCampground));


router.get('/:id',isLoggedIn,catchAsync(campgrounds.showCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

router.put('/:id',isLoggedIn, isAuthor,upload.array('images'),validateCampground,catchAsync(campgrounds.editCampground));

router.delete('/:id',isAuthor,catchAsync(campgrounds.deleteCampground));

module.exports=router;