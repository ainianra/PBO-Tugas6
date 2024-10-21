const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Render halaman register
router.get('/register', (req, res) => {
  res.render('register');
});

// Proses register user
router.post('/register', (req, res) => {
    const { username, email, name, phone, instagram, bio, password } = req.body;
  
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    const query = "INSERT INTO users (username, email, name, phone, instagram, bio, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [username, email, name, phone, instagram, bio, hashedPassword], (err, result) => {
      if (err) throw err;
      res.redirect('/auth/login');
    });
});

// Render halaman login
router.get ('/login', (req, res) => {
    res.render('login');
});

// Proses login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query ke database
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        
        // Jika user ditemukan
        if (result.length > 0) {
            const user = result[0];

            // Cek apakah password cocok
            if (bcrypt.compareSync(password, user.password)){
                req.session.user = user;
                res.redirect('/auth/profile');
            } else {
                res.send('Incorrect password');
            }
        } else {
            res.send('User not found');
        }
    });
});

// Render halaman profil user
router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', {user: req.session.user});
    } else {
        res.redirect('/auth/login');
    }
});

// Proses logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports=router;