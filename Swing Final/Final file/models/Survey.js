
var mongoose = require('mongoose');

var surveySchema = new mongoose.Schema({
  user: [{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
   last_modified: Date,
  surveydata: [{
    surveydate: Date,
  	surveyresult:String
  }]

});


module.exports = mongoose.model('Survey', surveySchema);