// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var Link = require('../models/link');

var Links = new new URLs({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now },
});


Links.model = Link;

module.exports = Links;
