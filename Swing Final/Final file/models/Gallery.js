
var mongoose = require('mongoose');

var gallerySchema = new mongoose.Schema({
  user: [{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
  imagepath: [{type:String}]
/* imagepath: String*/
/*should imagepath not have type for array????: rob question*/
});


module.exports = mongoose.model('Gallery', gallerySchema);