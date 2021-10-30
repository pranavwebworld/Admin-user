var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var addData = require('../usersdata/usersdata')
var fulldata = []
data = true;

router.get('/admintable', function (req, res, next) {


  res.render('tablerendertry')


});



router.get('/adlogin', function (req, res, next) {




  if(req.session.admin)
{

res.redirect('/admin')

}else{


  res.render('loginAdmin',{response:" "})

}

});



// router.get('/admin', function(req, res, next) {

//   res.render('admin')


// });


router.post('/adlogin', (req, res) => {

  // console.log(req.body);

  addData.adLogin(req.body).then((response) => {

    console.log('response inside admin')
    console.log(response)


    if (response.status) {


      req.session.adminloggedIn = true;

      req.session.admin = response.user

      res.redirect('/admin')

    } else {

      res.render('loginAdmin',{response})
      

      // console.log(response);

    }


  })


})




router.post('/add', function (req, res, next) {

  // res.render('admin')

  // console.log(req.body)

  addData.addUser(req.body).then((result) => {

    res.redirect('/admin')

  }).catch((e) => {

    console.log(e);


  })



});






router.get("/", (req, res) => {


if(req.session.admin)
{
  addData.getUser().then((gotdata) => {

    console.log(gotdata);



    res.render('admin', { indata: gotdata })

    console.log("inside got data", gotdata);

  })
}else{

res.redirect('/admin/logout')


}

})




router.get('/userdelete/:id', (req, res) => {

  let userId = req.params.id
  console.log("inside userId",userId);

 


  if(req.session.user){

  if(userId == req.session.user._id ){


  req.session.user = null;
 

  }
  }

  addData.deleteUser(userId).then((deluser,userId) => {

    

    
    res.redirect('/admin')

  })

})

router.get('/editUser/:id', async (req, res) => {

  let editUser = await addData.getUserDetails(req.params.id)

  console.log(editUser)


  res.render('edituser', { editUser })

})



router.post('/editUser/:id', async (req, res) => {

  let editUser = await addData.getUserDetails(req.params.id)

  addData.updateUser(req.params.id, req.body).then(() => {



    res.redirect('/')


  })
  res.redirect('/admin')


})



router.post('/search', async (req, res) => {


  console.log(req.body)
  addData.searchUser(req.body).then((searchResult) => {


    // res.redirect('/admin')
    res.render('cancel', { indata: searchResult })

  })


})



router.get('/blockuser/:id', (req, res) => {


  let userId = req.params.id

  if(req.session.user){

    if(userId == req.session.user._id ){
  
  
    req.session.user = null;
   
  
    }
    }
  

  addData.blockUser(userId).then((data, user) => {


    console.log(data);


  })

  res.redirect('/admin')


})


router.get('/logout', function (req, res, next) {




 if(req.session.admin)
 {

  res.redirect('/admin')

 }else{

res.redirect('/admin/adlogin')


 }
 




});

router.post('/logout', function (req, res, next) {



  
  req.session.admin=false

  res.render('loginAdmin',{response:""})


});



module.exports = router;