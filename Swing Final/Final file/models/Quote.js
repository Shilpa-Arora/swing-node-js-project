var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var ItemsSchema = new mongoose.Schema({
  quotation: String,
  image: String,
  author: String
  
});
ItemsSchema.plugin(random);
module.exports = mongoose.model('quotes', ItemsSchema);