const { string } = require('joi');
const mongoose=require('mongoose');
const Review = require('./reviews');
const Schema=mongoose.Schema;
const imageSchema= new Schema({
    url:String,
    filename:String
});

imageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload','/upload/w_150/h_150');
    
})
const opts={ toJSON:{ virtuals:true}}
 
const campgroundShema=new Schema({
    title:String,
    images:[
       imageSchema
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

},opts);
campgroundShema.virtual('properties.popUpMarkup').get(function(){
    return `<h3><a href="campgrounds/${this._id}"> ${this.title} </a></h3>`;
})


campgroundShema.post('findOneAndDelete',async function(firedItem){
    console.log(firedItem);
    if(firedItem){
        await Review.deleteMany({
            _id: {
                $in:firedItem.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',campgroundShema);
