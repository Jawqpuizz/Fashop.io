const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
        host: process.env.DB_host,
        user: process.env.DB_user,
        password:  process.env.DB_password,
        database: process.env.DB_name,
    });

exports.register = (req,res) =>{
    var time = new Date();
    var hashedpass;
  
    const{ role,name, email, pass} = req.body;
    

  
                                                      // this is callback function                           
    db.query('SELECT * FROM users WHERE username = ?', [name], (error,result) =>{
        if(error){
            console.log(error); 
        }
            
        if(result.length > 0 ){
            console.log('I am here');
             return res.render('/pages/register',{
                message:'This username is already in use'
            });
        }
    });    

    var hashedpass;
    db.query('SELECT * from users WHERE email = ?', [email], async(error,result) =>{
            if(error){
                console.log(error); 
            }
                
            if(result.length > 0 ){

                return res.render('pages/register',{
                    message:'This email is already registered'
                });
            }else{
                 hashedpass = await bcrypt.hash(pass, 8)
            }
          
           
    });          
    
            // when there is no error let insert data to the database
    db.query('INSERT INTO users SET ?',{timestamp: time, role: role,username:name,email:email,password:hashedpass},(error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    return res.render('pages/register',{
                        message: 'This user has been registered successfully..'
                    })
                }
    

    });
        
       

    

    res.render('pages/register');


}    

