var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var util = require('../lib/utility');

var db = require('../app/config');
var User = db.User;
var Link = db.URL;
var Users = db.Users;
var Links = db.URLs;
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err) {
          //Links.add(newLink);
          res.send(200, link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  console.log('logging in user');
  var username = req.body.username;
  var password = req.body.password;

  User
    .findOne({ username: username }, function(err, user) {
      console.log('user==========================', user)
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          console.log('comparing password');
          console.log(match)
          if (match) {
            console.log('matching password, should login now');
            util.createSession(req, res, user);
          } else {
            console.log('got here for some reason');
            res.redirect('/login');
          }
        });
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User
    .findOne({ username: username }, function(err, user) {
      if (!user) {
        //hash password
        //bcrypt.hash(password, null, null, function(err, hash) {
        //
        //})
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err) {
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
        if (err) {
          console.log(err);
        }
        return res.redirect(link.get('url'));
      });
    }
  });
};
