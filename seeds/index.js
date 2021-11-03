
const mongoose=require('mongoose');
const users=require('../models/users');
const cities=require('./description');
const {places,descriptors}=require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/fitness',{useNewUrlParser:true, useUnifiedTopology:true});

/* const db=mongoose.connect;
//db.on("error", console.error.bind(console,"connection error"));
//db.once("open", ()=>{
    console.log("Database connected")
}); */

const s=array=>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
   await users.deleteMany({});
   for(let i=0;i<50;i++){
       const random1000=Math.floor(Math.random()*100);
      const u=new users({
        location: `${cities[random1000]?.city}, ${cities[random1000]?.state}`,
        username: `${cities[random1000]?.username}`,
        title: `${s(places)}, ${s(descriptors)}`
       })
       await u.save();
   }
}
seedDB().then(()=>{
    mongoose.connection.close();
});