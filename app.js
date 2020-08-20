const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyPaser = require('body-parser');


// because we store the password and all the sensitive data to another file
// './'means the file in the same path with app.js, you can name is as password.env or whatever name you want
dotenv.config({path:'./.env'})

const app = express();
// create connection to the database
const db = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password:  process.env.DB_password,
    database: process.env.DB_name,
});
//connect here
db.connect((err) =>{
    if(err) throw err;
    console.log('Database Connected');

});

// create static file (HTML,CSS,JS)
app.use(express.static(__dirname+'/public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyPaser.urlencoded({extended: true}));
app.set('views',(__dirname+'/views'));
//
app.set('view engine', 'ejs');
//this will call pagesmanager.js (this folder has all render each page script )
app.use('/',require('./routes/pagesmanager'));
app.use('/action', require('./routes/actions'));




// will allow you to grab data in any html form



app.listen('3000',()=> {
        console.log('sever started on port 3000')
});