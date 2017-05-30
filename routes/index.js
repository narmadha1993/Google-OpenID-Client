var express = require('express');
var router = express.Router();
var passport= require('passport');
var https=require('https');
var http=require('http');
var json=require('json');
var buffer1="";
var buffer2="";
var nonce="";

var noncecontent=JSON.stringify(
{
  "url": "http://www.google.com",
  "cuid": "S-SCLLOGIN-SCL1_ADMIN",
  "realm": "S-SCLLOGIN-SCL1"
});

var option= {
  host: 'authn-4-stg.run.covisintrnd.com',
  port: 443,
  path:'/authn/nonce',
  method: 'POST',
  headers:
  {
  "x-requestor":"googlelogin",
  "x-requestor-app":"googlelogin",
  "Content-Type": "application/vnd.com.covisint.platform.authn.nonce.v1+json",
  "Content-Length":Buffer.byteLength(noncecontent),
  "Accept": "application/vnd.com.covisint.platform.authn.nonce.v1+json",
  "x-realm": "S-SCLLOGIN-SCL1",
  "Cache-Control": "no-cache"
}};
var xsrfcontent=
{
  "realm":"S-SCLLOGIN-SCL1",
  "nonce":"",
  "url":"http://www.google.com"
};

var option1= {
  host: 'apistg.np.covapp.io',
  port: 443,
  path:'/authn/v4/sessionToken/nonce/validate',
  method: 'POST',
  headers:
  {
  "Accept":"application/vnd.com.covisint.platform.nonce.response.v1+json",
  "Content-Type": "application/vnd.com.covisint.platform.nonce.request.v1+json",
  "Content-Length":Buffer.byteLength(JSON.stringify(xsrfcontent)),
  "x-realm": "S-SCLLOGIN-SCL1",
  "x-requestor": "S-SCLLOGIN-SCL1_ADMIN",
  "x-requestor-app": "googlelogin",
  "realmId": "S-SCLLOGIN-SCL1",
  "Cache-Control": "no-cache"
  }};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Google login' });
});
router.get('/googlelogin',passport.authenticate('google', {scope:'https://www.googleapis.com/auth/plus.login'}));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
  	console.log('okay');
    res.redirect('/profile');
  });
router.get('/profile',
	function(req,res){
     var noncereq=https.request(option,function(res){
      console.log('send request');
      //var buffer="";
      res.setEncoding("utf-8");
      res.on("data",function(data){
        //console.log('get data');
        buffer1+=data;
        buffer1=JSON.parse(buffer1);
        xsrfcontent.nonce=buffer1.nonce;
      });

      res.on("end",function(){
        console.log('get nonce');
        console.log(buffer1);//make second request here
      //  console.log(buffer1.nonce)
      option1["headers"]["Content-length"]=Buffer.byteLength(JSON.stringify(xsrfcontent));
      var xsrfreq=https.request(option1,function(res){
        console.log('send request');

        res.setEncoding("utf-8");
        res.on("data",function(data){
          console.log('get data');
          buffer2+=data;
        });
        res.on("end",function(){
          console.log('get buffer');
          console.log(buffer2);
        })
      })
      xsrfreq.write(JSON.stringify(xsrfcontent));
      xsrfreq.end();
      })

  });

     noncereq.write(noncecontent);
     //noncereq.end();
		res.render('profile',{user:req.user});
	})
module.exports = router;
