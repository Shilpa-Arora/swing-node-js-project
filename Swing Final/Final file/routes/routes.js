var express = require('express');
//1. Add path module
var path = require('path');
var flash = require('connect-flash');

var router = express.Router();


var mongoose = require('mongoose');


var random = require('mongoose-simple-random');
/*change model*/
var Gallery = require('../models/Gallery.js');
var User = require('../models/User.js');
var Quote = require('../models/Quote.js');
var Survey = require('../models/Survey.js');
var passport = require('passport');
var nodemailer= require ('nodemailer');   
var hashcash = require('nodemailer-hashcash');
var transporter= nodemailer.createTransport('smtps://shilarora10@gmail.com:plumpeach@smtp.gmail.com');    
var transporterSup=nodemailer.createTransport('smtps://shilwebsup@gmail.com:plumpeach@smtp.gmail.com');   
//transporter.use('compile', hashcash());   
//transporterSup.use('compile', hashcash());
 var multer   =  require ('multer');
 var storage =  multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/gallery')
  },
  filename: function (req, file, cb) {
    cb(null,req.user.id +'-'+file.fieldname + '-' + Date.now()+'.jpg')
  } 
});
 var upload = multer({ storage:storage ,limits:{fileSize: 15000000}});


 var store =  multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/profileimages')
  },
  filename: function (req, file, cb) {
    cb(null,req.user.id +'-'+file.fieldname + '-' + Date.now()+'.jpg')
  } 
});
 var uploading = multer({ storage:store ,limits:{fileSize: 15000000}});



function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}





/* 2. GET login page. */
router.get('/', function(req, res) {
	  res.render('login', { title: 'swing/login' });
}); 

router.post('/login',
  passport.authenticate('local', { successRedirect: '/home',
                                   failureRedirect: '/'
                                   /*failureFlash: true */})
);


/* 3. GET register page. */
router.get('/register', function(req, res) {
	  res.render('register', { title: 'swing/register' });
}); 

router.post('/register', function(req, res) {



if(req.body.password === req.body.confirm){


    User.register(new User({ username : req.body.username,
    	email : req.body.email }), req.body.password, function(err, user) {
        if (err) {
        	 console.log(err);
   
             res.render('register', { user : user,title:'Register' });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/home');
        });
    });
  }
  else{
    console.log("password doesnt match");

     res.redirect('/register');
  }
});

/* 4. GET home page. */
router.get('/home',isLoggedIn, function(req, res) {

Quote.findOneRandom(function (err, quote) {
  console.log(quote);

    res.render('home', {quote : quote, user : req.user , title: 'swing/home' });
    });
}); 


/* 5. GET account page. */
router.get('/account',isLoggedIn, function(req, res) {
     console.log(req.user);
    res.render('account', {user : req.user , title: 'swing/account'});
 
}); 

router.post('/account/:id',isLoggedIn,uploading.single ('image'), function(req, res) {
   console.log(req.user.theme);
   var  tempusername;
   var  tempprofileimage;
   var  tempemail;
    var  temptheme;
     console.log(req.body.optradio);
if (req.body.username === null || req.body.username === '') {
 tempusername = req.user.username;
}
else{
 tempusername = req.body.username;
}
if (req.file === undefined) {
 tempprofileimage = req.user.profileimage;
}
else{
 tempprofileimage = req.file.filename;
}
if (req.body.email === null || req.body.email === '') {
 tempemail = req.user.email;
}
else{
 tempemail = req.body.username;
}
if (req.body.optradio === null || req.body.optradio === undefined) {
 temptheme = req.user.theme;
}
else{
 temptheme = req.body.optradio;
}
console.log(tempusername);
console.log(tempprofileimage);
console.log(tempemail);
console.log(temptheme);
User.update({_id: req.user.id}, {
  username: tempusername,
   profileimage: tempprofileimage,
   theme:temptheme,
        email: tempemail
    },function(err, numberAffected, rawResponse) {
       console.log(err);
    });
     res.redirect('/account');
}); 




/* 7. GET survey page. */
router.get('/survey',isLoggedIn, function(req, res) {

    res.render('survey', {user : req.user , title: 'swing/survey' });
}); 







router.post('/survey',isLoggedIn, function(req, res)
 {
console.log(req.user.id);
var surveytotal;
var surveyresult;
var datedifference;
surveytotal = parseInt(req.body.range1) + parseInt(req.body.range2) + parseInt(req.body.range3) + parseInt(req.body.range4) + parseInt(req.body.range5);
surveyresult = surveytotal;
 
Survey.findOne({user:req.user.id}, function (err, survey){
if(survey===null)
{
   Survey.findOneAndUpdate({user:req.user.id},
  {
$set:{last_modified:Date.now()},
  $push:{surveydata:{surveydate:Date.now() , surveyresult: surveyresult}}
  },
  {upsert:true}, 
  
  function(err, doc)
  {
    if (err){
      console.log(err);
    }
   
});
    console.log('submit');
     res.redirect('/home'); 
}
else{
  console.log(survey.last_modified);
  console.log(Date.now());
  datedifference = (Date.now() - survey.last_modified)/1000;
  console.log(datedifference);
if(datedifference > 5)/*86400 are number of seconds in 1 day change it to less number for making graph*/
  {
    var survey_date=Date.now();
    /*86400 are number of seconds in 1 day cahnge it to 86400*/
    
  Survey.findOneAndUpdate({user:req.user.id}, 
  {
  $set:{last_modified:survey_date},
  $push:{surveydata:{surveydate:Date.now() , surveyresult: surveyresult}}
  },

  {upsert:true}, 
  function(err, doc)
  {
    if (err){
      console.log(err);
    }
   
});
    console.log('submit');
     res.redirect('/home');
   }

else{

 console.log('not submit');
   res.redirect('/surveycompleted');

}
}
});
}); 


/* 8. GET progress page. */
router.get('/progress',isLoggedIn, function(req, res) 
{
Survey.findOne({user:req.user.id}, function (err, survey)
{
if(err) next(err);

console.log(survey);
if(survey === null)
{

res.render('survey', {user : req.user , title: 'swing/survey' });
}

else if(survey!= null && survey.surveydata.length < 7)
{
res.render('information', {user : req.user , title: 'swing/information' }); 
}
else
{
var surveyarray;
 var resultvalues = [];

surveyarray = survey.surveydata;

var sevenvalues=surveyarray.reverse();
// reverse the main array to get last 7 days values


for(var i = 0; i < 7; i++){

resultvalues[i] =  sevenvalues[i].surveyresult;
// store in reverse order to new array of length 7
 console.log(resultvalues);
}
resultvalues=resultvalues.reverse();
// reverse the new array to get Day 1 to Day 7 values
console.log(sevenvalues);
console.log(survey.surveydata.length);
res.render('progress', {data: resultvalues , user : req.user , title: 'swing/progress' });

}


});

/*    res.render('progress', {user : req.user , title: 'swing/progress' });*/
}); 


/* 9. GET aboutus page. */
router.get('/aboutus',isLoggedIn, function(req, res) {

    res.render('aboutus', {user : req.user , title: 'swing/aboutus' });
}); 


/* 10. GET help page. */
router.get('/help', function(req, res) {
    res.render('help', { title: 'swing/help' });
}); 

router.post("/help",function(req,res,next){   
  //var lastName= req.body.lname;   
  var firstName= req.body.username;   
  var emailTo= req.body.email;    
  //var emailSubject= req.body.subject;   
  var emailMessage= req.body.message+" Recieved from Name:"+" "+ firstName+" with Email Address: "+emailTo;   
      
      
  // setup email with data to send from admin account to support account    
  var mailOptions = {   
     from: 'shilarora10@gmail.com', // admin address    
     to: 'shilwebsup@gmail.com', // support address   
     subject: "Message from Swing App", // Subject line   
     text: emailMessage // plaintext body   
        
            };    
    
  // send mail with defined admin transport object    
  transporter.sendMail(mailOptions, function(error, info){    
     if(error){     
         return console.log(error);   
     }    
  else{   
              // setup email with data to send from support account to customer account   
            var mailOptionsSup = {    
            from: 'shilwebsup@gmail.com', // sender address   
            to: emailTo, // list of receivers   
            subject: 'Message from Shil Inc. Support', // Subject line    
            text: 'Hello  '+firstName+','+'\u000d \u000d'+'Thanks for choosing Shil Inc. We will send you complete details shortly.'+'\u000d \u000d'+'Regards,'+'\u000d \u000d'+'Shil Inc.' // plaintext body   
    
            };    
            // send mail with defined support transport object    
              transporterSup.sendMail(mailOptionsSup, function(error, info){    
                  if(error){    
                          return console.log(error);    
                      }   
                  else    
                  {   
                      res.redirect('/login');
                  }       
        
            });   
  }   
    
    });   
    
    
 });    
 
/* 11. GET gallery page. */
router.get('/gallery',isLoggedIn, function(req, res) {
  console.log(req.user);
 Gallery.findOne({user:req.user.id}, function (err, gallery){
    if(err) next(err);
  console.log(gallery);
  if (gallery===null) { res.render('initialgallery', {user : req.user ,title: 'swing/gallery' });} 
  else { res.render('gallery', {user : req.user , gallerys : gallery.imagepath, title: 'swing/gallery' });}
     /* res.render('gallery', { gallerys : gallery.imagepath, title: 'swing/gallery' });*/
});
}); 

router.post('/gallery',isLoggedIn,upload.single ('image'), function(req, res, next) {
 console.log(req.file);
  console.log(req.file.filename);
  console.log(req.user.id);
  Gallery.findOneAndUpdate({user:req.user.id}, {
  
   /* imagepath: req.file.filename*/
    $push:{imagepath: req.file.filename}
  },
  {upsert:true}, 
  function(err, doc){
    if (err){
      console.log(err);
    }
   
});

/*   Gallery.create({
   user : req.user.id,
    imagepath: req.file.filename

  }, function(){

  res.redirect('/gallery');
  })*/

 /* Gallery = new Gallery({
    user: [req.user.id],
    imagepath: [req.file.filename]
  });

  Gallery.save(function(error) {
    console.log(error);
  });*/
/*  Gallery.insert({
   user : req.user.id,
    imagepath: req.file.filename

  }, function(){

  res.redirect('/gallery');
  })*/
    res.redirect('/gallery');

}); 

/* 12. GET quotes page. */


router.get('/quotes',isLoggedIn, function(req, res, next) {
 Quote.find(function(err, quotes) {
  if(err) next(err);
  console.log(quotes);
    res.render('quotes', { user : req.user ,quotes: quotes, title: 'swing/quotes' });
});
})

/*13.logout*/
  router.get('/logout', function (req, res, next) {
     req.logout();
    res.redirect('/');
  });

/* 15. GET gallery page. */
router.get('/terms',isLoggedIn, function(req, res) {
    res.render('terms', {user : req.user , title: 'swing/terms' });
}); 
/* 16. GET gallery page. */
router.get('/policies',isLoggedIn, function(req, res) {
    res.render('policies', {user : req.user , title: 'swing/policies' });
}); 
router.get('/information',isLoggedIn, function(req, res) {

    res.render('information', {user : req.user , title: 'swing/information' });
}); 
router.get('/surveycompleted',isLoggedIn, function(req, res) {

    res.render('surveycompleted', {user : req.user , title: 'swing/surveycompleted' });
}); 

module.exports = router;
