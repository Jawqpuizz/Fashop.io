// config stratregy before using it
require('dotenv').config;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');// to hash password
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err)=>{
if(err){
    console.log(err);
}
console.log("Database is connected")
});

module.exports = function(passport){

     // used to serialize the user for the session
     
    passport.serializeUser((user,done)=>{
        done(null,user.id);

    });
    // used to deserialize the user
    passport.deserializeUser((id,done)=>{
        console.log(id);
       db.query("SELECT * FROM users WHERE id = ?",[id], (err, result)=>{
        done(err,result[0]);
       })
    });

    //set up local strategy 
    passport.use(
        'local-signup',
        new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass back the entire request to call back 

    },
    // preserve data in the fields which users fill it out 

    
    function(req,email,password,done){
        var role = req.body.role;
      
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err,result)=>{
            if(err) return done(error);
            if(result.length > 0){
                return done(null, false, req.flash('message','This email is already taken'))
            }else{
                // create the  new user
                var time = new Date();
                var hashedpass = await bcrypt.hash(password, 8);
                // when there is no error let insert data to the database
                var newUser ={
                    timestamp: time,
                    role: role,
                    email:email,
                    password:hashedpass
                };
                db.query('INSERT INTO users SET ?',{timestamp: time, role: role,email:email,password:hashedpass},(error,result)=>{
                if(error){
                    console.log(error);
                }
                newUser.id = result.insertId;// get the id of the last one that we've just insert
                 return done(null,newUser)  

                });  
            }
        });
    })// end of local-signup strategy
    );

    //for login 
    passport.use(
        'local-login',
        new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass back the entire request to call back 

    },
    function(req,email,password,done){
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err,result)=>{
            if(err) return done(error);
            if(result.length == 0){
                return done(null, false, req.flash('message','Invalid email or password'))
                 //if the email was found then check if the password is correct
            }else if(!(await bcrypt.compare(password,result[0].password))){
                return done(null, false, req.flash('message','Invalid email or password'))
                
            }else{
                console.log(result[0]);
                return done(null,result[0]);
                
            }
        });
    })// end of local login strategy
    );


// google strategy

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/fashop.io'

},
function(accessToken, refreshToken, profile,cb){
    console.log(profile);
   
    db.query("SELECT * FROM users WHERE socialId = ?", [profile.id], (err,result)=>{
        if(err) return cb(error);
        if(result.length > 0){
            return cb(null,result[0])
        }else{
            // create the  new user
            var time = new Date();
            var role;
            // when there is no error let insert data to the database
            var newUser ={
                timestamp: time,
                socialId: profile.id,
                email:profile._json.email,
            };
            db.query('INSERT INTO users SET ?',{timestamp: time, socialId: profile.id,email:profile._json.email},(error,result)=>{
            if(error){
                console.log(error);
            }
            newUser.id = result.insertId;// get the id of the last one that we've just insert
             return cb(null,newUser)  

            });  
        }
    });

}
))
// facbook strategy 
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/fashop.io",
    profileFields:['id','emails','name'] // before I added this line the JSON file didn't give me an emails fielda
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      console.log(profile.id);
      console.log(profile._json.id);
    db.query("SELECT * from users WHERE socialId = ?",[profile.id],(err,result)=> {
      if (err) { 
          return done(err); 
        }else if(result.length > 0){
           return done(null, result[0]);
        }else{
            // create the  new user
            var time = new Date();
            var role;
            // when there is no error let insert data to the database
            var newUser ={
                timestamp: time,
                socialId: profile.id,
                email: profile.emails[0].value,
            };
            db.query("INSERT INTO users SET ?",[newUser],(err,result)=>{
                if(err) throw err;
                newUser.id = result.insertId
            return   done(null,newUser);
            })
        }
      
    });
  }
));


}