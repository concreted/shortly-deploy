var Bookshelf = require('bookshelf');
var mongoose = require('mongoose');
var path = require('path');

var bcrypt = require('bcrypt-nodejs');

var dbpath = ''

if (process.env.NODE_ENV === 'production') {
  dbpath = 'mongodb://MongoLab-5:GorvbZaXsOMrDjigx__C6FRPdLNlhD_Qg6CkGr6Lq8U-@ds031108.mongolab.com:31108/MongoLab-5';
} else {
  dbpath = 'mongodb://localhost/test';
}

console.log(dbpath);

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   // yay!
//   console.log('db connected');
// });

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: dbpath,
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });




// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

var db = {};

db.URLs = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now },
});

db.Users = new mongoose.Schema({
  username: String,
  password: String,
  date: { type: Date, default: Date.now }
});

db.User = mongoose.model('User', db.Users);
db.URL = mongoose.model('URL', db.URLs);

//db.Links = new mongoose.model('URL', db.URLs);

db.User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

mongoose.connect(dbpath);
var dbconnection = mongoose.connection;
dbconnection.once('open', function callback () {
  // yay!
  console.log('db connected');
  db.URL.find({}, function(err, found) {
    console.log(found);
  });
});


module.exports = db;
