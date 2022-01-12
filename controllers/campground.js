const Campground = require("../models/campground");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({ accessToken:mapBoxToken});



module.exports.index=async (req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds});
};

module.exports.renderNewForm= (req,res)=>{
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground=async (req,res)=>{
    const campground=new Campground(req.body.campground);
    campground.author=req.user._id;
    const geodata=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    campground.geometry=geodata.body.features[0].geometry;
    console.log(geodata.body.features[0].geometry);
    for(let img of req.files){
        campground.images.push({
            url:img.path,
            filename:img.filename
        })   
    }
    console.log(campground);
    await campground.save();
    req.flash('success','Successfully created new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground=async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate({
        path:'author'
    });
    if(!campground){
        req.flash('error','Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/shows.ejs',{campground});
}

module.exports.renderEditForm=async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error',`Cannot Find Campground`);
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs',{campground});
}

module.exports.editCampground=async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,req.body.campground);
    const imgs=req.files.map(img=>({url:img.path,filename:img.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteimages){
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}});
        console.log(req.body);
    }
    await campground.save();
    req.flash('success','Successfully Updated!');
    res.redirect(`/campgrounds/${id}`);  
}

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndDelete(id);
    if(!camp){
        req.flash('error',`Cannot Find Campground`);
        return res.redirect('/campgrounds');
    }
    req.flash('error','Campground Deleted Successfully!');
    res.redirect('/campgrounds');
}