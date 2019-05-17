var express = require('express');
var router = express.Router();
const isLoggedIn = require('../helpers/auth');

/* GET home page. */
module.exports = function(passport){

  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', {user: req.user});
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  router.get('/login', function(req, res){
    res.render('login', {message: req.flash('loginMessage')});
  })

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get('/signup', function(req, res){
    res.render('signup', {message: req.flash('signupMessage')});
  })

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/auth/google', passport.authenticate('google', {
    scope: 'email'
  }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  router.get('/connect/google', passport.authorize('google', {
    scope: 'email'
  }));

  router.get('/connect/google/callback', passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  router.get('/unlink/google', isLoggedIn, function(req, res){
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err){
      res.redirect('/profile');
    });
  });

  return router;

}
