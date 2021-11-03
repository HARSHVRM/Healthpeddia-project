const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema(
    {
        username:String,   
        location:String,
        title:String,
        comments:String
    }
)


 module.exports= mongoose.model("USERS", UserSchema);

