var express = require('express');
var router = express.Router();
var MongoClient= require('mongodb').MongoClient
const userHelpers= require('../helpers/user-helpers')
var  addData = require('../usersdata/usersdata')


/* GET home page. */
router.get('/', function(req, res, next) {


  let userSession=req.session.user
  console.log(req.session.user );

   if(req.session.user)
   {

    res.render('index',{userSession})

   } else
   {

    res.redirect('/login')

   }



});


router.post('/', function(req, res, next) {



  let userSession=req.session.user
  console.log();

   if(req.session.user)
   {

    res.render('index',{userSession})

   } else
   {

    res.redirect('/login')

   }


});

router.get("/signup",(req,res)=>{

  res.render('signup')

addData.getUser().then((gotdata)=>{

  console.log(gotdata);

  // res.render('admin',{ indata : gotdata })

 
  

})

  res.redirect('/login')


})

router.post('/signup', function(req, res, next) {
 

  addData.addUser(req.body).then((result)=>{

    res.redirect('/signup')
  }).catch((e)=>{
    console.log(e);
  })
   
  res.redirect('/login')
  

});


router.get('/login', function(req, res) {




  if(req.session.user)
  {
    

    res.redirect('/')


  }else{


    res.render('login',{response:" "})

  }


});



router.post('/login',(req,res)=>{

addData.doLogin(req.body).then((response)=>{


console.log('inside user response')

console.log(response)


if(response.status){

req.session.user=response.user

req.session.loggedIn=true;

res.redirect('/')

}else{


res.render('login',{response})

// res.redirect('/login')


}

})

})






router.get('/logout', function(req, res, next) 
{

console.log('get logout');

req.session.user=null;

res.redirect('/login')

});



router.post('/logout', function(req, res, next) 
{

  req.session.loggedIn=false;

  console.log('post logout');
req.session.user=null;

res.redirect('/login')

});


module.exports = router;
