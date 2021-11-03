const express=require('express');
const router=express.Router({mergeParams:true});
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync');
const users=require('../models/users');

const { commentsSchema}=require('../schema');
const {loggin}=require('../middleware');

const commentsValidation=(req,res,next)=>{                       // JOI validations at comment section.
    const {error}=commentsSchema.validate(req.body); 
    if(error){
      const m=error.details.map(el=>el.message).join(',');
      throw new ExpressError(m,400)
    }else{
      next();
    }
} 

router.get('/',catchAsync(async(req,res)=>{
    const user=await users.find({});
    res.render('comments/index', {user})
  }))
  
  router.get('/new',loggin,(req,res)=>{
    res.render('comments/new')
  })
  
  router.post('/',loggin, commentsValidation, catchAsync(async(req,res,next)=>{ 
    const comment=new users(req.body.comments);
    await comment.save();
    req.flash('success', 'You have successfully created a new comment')
    res.redirect(`/comments/${comment._id}`);
  }))
  
  router.get('/:id',loggin,catchAsync(async(req,res)=>{
   const use=await users.findById(req.params.id);
   if(!use){
       req.flash('error', 'Sorry, cannot make a new comment!!!!');
       return res.redirect('/comments')
   }
    res.render('comments/show',{use}); 
  }))
  
  router.get('/:id/edit',loggin,catchAsync(async(req,res)=>{
    const edit=await users.findById(req.params.id);
    if(!edit){
        req.flash('error', 'Sorry, cannot make a new comment!!!!');
        return res.redirect('/comments')
    }
    res.render('comments/edit',{edit})
  }))
  
  router.put('/:id', loggin, commentsValidation, catchAsync(async(req,res)=>{
    const {id}=req.params;
    const update=await users.findByIdAndUpdate(id,{...req.body.comments });
    req.flash('success', 'Successfully updated the comment')
    res.redirect(`/comments/${update._id}`)
  }))
  
  router.delete('/:id',loggin,catchAsync(async(req,res)=>{
    const {id}=req.params;
    await users.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the comment')
    res.redirect('/comments')
  }))
  
  router.get('/:id/edit',(req,res)=>{
     const { id }=req.params;
     const comment=comments.find(c=>c.id===id);
     res.render('comments/edit', {comment})
  })
  
  
  module.exports=router;