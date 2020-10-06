const express = require('express');
const session = require('express-session');
const passport = require('passport')
const route = express.Router();

// you will access this route when you hit method POST which we set in form 
                                        // this call function register in action file inside controller folder 
route.post('/register',passport.authenticate('local-signup',{ 
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true// allow flash message

}));

 
route.post('/login',passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true// allow flash message
}), (req,res)=>{
    console.log(req.body.email);
 if(req.body.remember){
     req.session.cookie.maxAge = 1000 * 60 * 3;
 }else{
     req.session.cookie.expires = false;
 }
 res.redirect('/');
});



module.exports = route;