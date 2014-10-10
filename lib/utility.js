var request = require('request');
var favicon = require('favicon');
var fs = require('fs');
var http = require('follow-redirects').http;

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

exports.getThatIcon = function(url, code, cb){

  // request(url, function(err, res, html){
  //   if (err) {
  //     console.log('Error reading url heading: ', err);
  //     return cb(err);
  //   } else {
  //     var tag = /href="(.*favicon\.ico)"/;
  //     var match = html.match(tag);
  //     var faviconURL = match ? match[1] : null;

  //     console.log('favicon==================', faviconURL);

  //     if (!faviconURL) {
  //       return cb();
  //     }


  //     var file = fs.createWriteStream('public/assets/' + code + '.ico');

  //     https.get(faviconURL, function(response) {
  //       response.pipe(file);
  //       return cb();
  //     });
  //   }
  // });

  request(url, function(err, res, html){
    if(err){
      console.error('error fetching icon');
    } else {
      var file = fs.createWriteStream('public/assets/' + code + '.ico');

      favicon(url, function(err, favicon_url) {
        console.log('favicon==================', favicon_url);
        http.get(favicon_url, function(response) {
          //response.setEncoding('binary');

          response.pipe(file);

          //fs.writeFileSync('public/assets/' + code + '.ico', response);
          cb();
        });
      });
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

exports.isLoggedIn = function(req, res) {
  console.log('req.session', req.session);
  console.log(req.session.user);
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  console.log('this is req.session in checkUser', req.session);
  if (!exports.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      console.log("this is the new user:", newUser);
      console.log('this is req.session in createSession', req.session);
      req.session.user = newUser;
      console.log('this is req.session in createSession after adding user', req.session);
      res.redirect('/');
      console.log('Creating new session');
    });
};
