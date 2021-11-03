const express=require('express');
const router=express.Router();
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync');
const review=require('../models/reviews');
const {loggin}=require('../middleware')

const {reviewSchema}=require('../schema');

const reviewValidation=(req,res,next)=>{                        // JOI validations at reviews section.
    const {error}=reviewSchema.validate(req.body);    
       if(error){
         const m=error.details.map(el=>el.message).join(',');
         throw new ExpressError(m,400)
       }else{
         next();
       }
  } 

router.get('/', catchAsync(async(req,res,next)=>{
    res.render('nutritionFacts')
   }))


router.get('/',loggin,catchAsync(async(req,res,next)=>{
    const u=await review.find({});
    res.render('review/reviewIndex', {u})
  }))

module.exports=router;