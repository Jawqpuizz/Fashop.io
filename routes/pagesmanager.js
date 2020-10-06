 const express = require('express');
const passport = require('passport');
 const route = express.Router();

 route.get('/',isLoggedIn,(req,res) =>{
    res.render('index.ejs');

 });

 route.get('/register',(req,res) =>{
    res.render('pages/register.ejs',{
       message: req.flash('message'),
       
    });
 });

 route.get('/login',(req,res) =>{
   res.render('pages/login',{
      message: req.flash('message'),
   });
});
//sign-in by google
route.get('/auth/google',
passport.authenticate('google',{scope:['profile','email']})
);

route.get('/auth/google/fashop.io',
passport.authenticate('google',{failureRedirect:'/login'}),
(req,res)=>{
res.redirect('/');
});

//sign-in by facebook
route.get('/auth/facebook',passport.authenticate('facebook',{scope:['email']}));

route.get('/auth/facebook/fashop.io',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

//logout
route.get('/logout',(req,res)=>{
   req.logOut();
   res.redirect('/');
})
                     // check if the user login only the loggedIn user can user see the profile page 
route.get('/profile',isLoggedIn,(req,res)=>{
   res.render('index2.ejs')
})


// route middle ware to make sure that user is logged in
function isLoggedIn(req,res,next){
   //if user is authenticated in the session, carry on 
   if(req.isAuthenticated())
   return next();
   // if the user aren't logged in put them to login page
   res.redirect('/login');
}

// don't forget to export otherwise pages won't render
module.exports = route;