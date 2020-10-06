require('dotenv').config()
const express = require('express');
// const dotenv = require('dotenv');
const bodyPaser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
require('./config/passport.js')(passport);

const app = express();


// because we store the password and all the sensitive data to another file
// './'means the file in the same path with app.js, you can name is as password.env or whatever name you want
// dotenv.config({path:'./.env'}) // We just put it on the very top of the application and we don't need to requir it

// create static file (HTML,CSS,JS)
app.use(express.static(__dirname+'/public'));

// Parse URL-encoded bodies (as sent by HTML forms) we need to have this line of code to be able to get data from Form tag
app.use(bodyPaser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('views',(__dirname+'/views'));
app.set('view engine', 'ejs');
// passport configuration 

//require for passport
app.use(session({
    secret:'This is a secret for this project',
    resave:false,
    saveUninitialized:false
}));//sesion secret

app.use(passport.initialize());
app.use(passport.session()); //let passport to set the persistent login session
app.use(flash());//use connect-flash fo flash message store in session

//this will call pagesmanager.js (this folder has all render each page script ) it's more clean to have the get function in seperate file
app.use('/',require('./routes/pagesmanager'));
//This is route of the seperate post method,  
app.use('/action',require('./routes/actions'));



app.listen('3000',()=> {
        console.log('sever started on port 3000')
});