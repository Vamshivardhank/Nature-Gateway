const express=require('express');
const passport = require('passport');
const catchAsync = require('../helpers/catchAsync');
const User = require('../models/user');
const router=express.Router();
const users=require('../controllers/users');


router.get('/register',users.renderRegisterForm);

router.post('/register',catchAsync( users.Register));

router.get('/login',users.renderLoginForm);

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.Login);

router.get('/logout',users.Logout);


module.exports=router;