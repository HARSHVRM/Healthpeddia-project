const Joi=require('joi')

module.exports.commentsSchema=Joi.object({
    comments:Joi.object({
      username:Joi.string().required(),
      location:Joi.string().required(),
      title:Joi.string().required(),
      comments:Joi.string().required()
    }).required()
  });

module.exports.reviewSchema=Joi.object({
      review:Joi.object().keys({
      firstname:Joi.string().required(),
      lastname:Joi.string().required(),
      reviews:Joi.string().required()
    }).required()
  });
      
    
