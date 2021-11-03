const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const reviewSchema=new Schema({
    firstname:String,
    lastname:String,
    reviews:String
});

module.exports=mongoose.model('REVIEWS', reviewSchema);