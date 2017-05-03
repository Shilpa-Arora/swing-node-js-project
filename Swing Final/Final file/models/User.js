var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username:{type:String, required:[true, 'need to provide a username']},
	profileimage: { type: String, default: 'profile.svg' },
	theme: { type: String, default: 'main1.css' },
	gallery: [{type:mongoose.Schema.Types.ObjectId,ref:'Gallery'}],
	email:{type:String, required:[true, 'need to provide a valid email']}
});

var options = ({missingUsernameError: "Wrong Username", missingPasswordError: "Wrong Password"});
userSchema.plugin(plm,options);

module.exports = mongoose.model('User', userSchema);


