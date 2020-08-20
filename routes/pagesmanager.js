 const express = require('express');

 const route = express.Router();

 route.get('/',(req,res) =>{
    res.render('pages/index1');

 });

 route.get('/register',(req,res) =>{
    res.render('pages/register');
 });

// don't forget to export otherwise pages won't render
module.exports = route;