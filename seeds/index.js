const mongoose=require('mongoose');
const Campground=require('../models/campground.js');
const cities=require('./cities');
const {descriptors,places} =require('./seedhelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
     useUnifiedTopology:true,
})
.then(()=>{
    console.log("Connecting to Database");
})
.catch(err=>{
    console.log("Error in connecting to mongodb");
    console.log(err);
});

 
const sample=(array)=>{return array[Math.floor(Math.random()*(array.length))];}
const seedDb=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            author:"61d7ce8515dece1b83ecc792",
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio sapiente cupiditate minus voluptatem nesciunt, quos ducimus rerum dolorum possimus maiores doloribus, pariatur saepe commodi quod! Commodi quaerat enim ex iusto/?",
            location:`${ cities[rand1000].city },${cities[rand1000].state}`,
            price,
            geometry:{ 
                    type: 'Point',
                    coordinates: [ 
                        cities[rand1000].longitude,
                        cities[rand1000].latitude
                             ] 
                    },
            images:[
                {
                    url: 'https://res.cloudinary.com/df7rzvpdt/image/upload/v1641712144/YelpCamp/d7tvxloazozdivpydoyy.jpg',
                    filename: 'YelpCamp/d7tvxloazozdivpydoyy'
                  },
                  {
                    url: 'https://res.cloudinary.com/df7rzvpdt/image/upload/v1641712143/YelpCamp/mckf3ogdaovkhb8nvxh0.jpg',
                    filename: 'YelpCamp/mckf3ogdaovkhb8nvxh0'
                  },
                  {
                    url: 'https://res.cloudinary.com/df7rzvpdt/image/upload/v1641712178/YelpCamp/rxmfkubtxcg05tghkzqa.jpg',
                    filename: 'YelpCamp/rxmfkubtxcg05tghkzqa',
                  }
            ]
        });
        await camp.save();
    }

}
seedDb();

//'https://source.unsplash.com/collection/483251' 