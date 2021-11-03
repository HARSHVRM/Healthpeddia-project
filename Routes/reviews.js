const express=require('express');
const router=express.Router({mergeParams:true});   //for accessing params from parent route via child route.
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync');
const reviews=require('../models/reviews');

const {reviewSchema}=require('../schema');
const {loggin}=require('../middleware')

const reviewValidation=(req,res,next)=>{                        // JOI validations at reviews section.
    const {error}=reviewSchema.validate(req.body);    
       if(error){
         const m=error.details.map(el=>el.message).join(',');
         throw new ExpressError(m,400)
       }else{
         next();
       }
  } 
  
  
  router.post('/', loggin,reviewValidation, catchAsync(async(req,res,next)=>{ 
    const review=new reviews(req.body.review);
    await review.save();
    req.flash('success', 'Your have successfully created a review')
    res.redirect(`/review/${review._id}`);
  }))
  
  router.get('/:id', loggin,catchAsync(async(req,res,next)=>{          
     const review=await reviews.findById(req.params.id);
     res.render('review/reviewShow',{review})
  }))
  
  module.exports=router;