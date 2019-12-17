const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// User Model
const User = require('../models/user');



//Login
router.get('/login', (req,res) => res.render('login'));

//Register
router.get('/register', (req,res) => res.render('register'));

//Register handle
router.post('/register',(req,res) =>{
    const { name, email, password,password2 } = req.body;

    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all the fields'});
    }
    if(password !== password2){
        errors.push({msg: 'Password do not match'});
    }
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 Characters'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
       User.findOne({email:email})
       .then(user=>{
           if(user){
               //user exists
               errors.push({msg: 'Email already registered'});
               res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
           } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password (bcryptjs)
                bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Set pw to hash
                    newUser.password = hash;

                    // Save user
                    newUser.save()
                    .then( user =>{
                        req.flash('success_msg', 'Registered, please login.')
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err));
                }))
           }
       });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/users/login')
})
module.exports = router;