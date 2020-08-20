const express = require('express');
const actionController = require('../controller/actions');

const route = express.Router();
// you will access this route when you hit method POST which we set in form 
                                        // this call function register in action file inside controller folder 
route.post('/register',actionController.register);


// don't forget to export otherwise it won't render
module.exports = route;