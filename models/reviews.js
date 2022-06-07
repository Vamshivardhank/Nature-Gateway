const mongoose=require('mongoose');
const User=require('./user');
const {Schema}=mongoose;

const reviewShema=new Schema({
    body:{
        type:String
    },
    rating:{
        type:Number
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('Review',reviewShema);
