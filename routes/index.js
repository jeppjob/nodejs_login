const express = require('express');
const router = express.Router();
const Users = require('../models/user')
const { ensureAuthenticated } = require('../config/auth');
// Welcome Page
router.get('/', async (req,res) => {
    try{
        const users = await Users.find({})
        res.render('Welcome', {users: users})
    } catch {
        res.redirect('/users/login')
    }
});

// Dashboard
router.get('/users/dashboard', (req,res) => 
res.render('dashboard',{
    user: req.user
})
);
module.exports = router;