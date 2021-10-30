var db = require('../config/connection')
const bcrypt = require('bcrypt')
const { promise, reject } = require('bcrypt/promises')
const express = require('express')
const { response } = require('../app')
var objectId = require('mongodb').ObjectId
const session = require('express-session')

module.exports = {

    // addUser:(user,callback)=>{

    // // console.log(user)

    // db.get().collection('user').insertOne(user).then((data)=>{

    //     console.log("Hello");

    //     // console.log(data)
    //     console.log(data)
    //     callback(data)



    // })


    // }


    // }

    addUser: (user) => {

        return new Promise(async (resolve, reject) => {

            user.pass = await bcrypt.hash(user.pass, 10)

            user.isActive="Block"
            
            db.get().collection('user').insertOne(user).then((data) => {

                resolve(data)
            })
        })
        // this.getUser
    },
    getUser: (user) => {


        return new Promise(async (resolve, reject) => {


            let user = await db.get().collection('user').find().toArray()
            resolve(user);
        })
    },



    doLogin: (userlogdata) => {


        return new Promise(async (resolve, reject) => {
            console.log(userlogdata, "user find...");
            let loginStatus = false;
            let response = {}

            let userAuth = await db.get().collection('user').findOne({ email: userlogdata.email })

            console.log(userAuth)

            if (userAuth) {


            if(userAuth.isActive=="Block"){

                bcrypt.compare(userlogdata.pass, userAuth.pass).then((status) => {

                    if (status) {

                        console.log('login success')
                        response.user = userAuth
                        response.status = true
                        resolve(response)

                    } else {

                        console.log('login failed')
                        response.error="user not found"
                        response.status = false;
                        resolve(response)
                    }

                })


                 }else{
                    
                    console.log("user blocked")
                    response.user = userAuth
                    response.blockUser=false
                    response.status = false
                    response.error="User Blocked Contact Admin"
                    resolve(response)
                }



            } else {
                
                response.status = false
                response.error="User Not Found"
                resolve(response)
                console.log('user not found')
            }

        })

    },



    adLogin: (adlogdata) => {


        return new Promise(async (resolve, reject) => {
            
            let loginStatus = false;
            let response = {}

            let userAuth = await db.get().collection('admin').findOne({ email: adlogdata.email })

            console.log(userAuth)

            if (userAuth) {

                bcrypt.compare(adlogdata.pass, userAuth.pass).then((status) => {

                    if (status) {

                        console.log('Admni login success')
                        response.user = userAuth
                        response.status = true;
                        resolve(response )

                    } else {

                        console.log('Admin login failed')
                        response.error = " incorrect credentials"
                        response.status = flase;
                        resolve(response)
                    }

                })


            } else {
                response.error = "Admin not found "
                response.status = false;
                resolve(response)
                console.log('admin not found')
            }

        })

    },



    deleteUser: (userId) => {



        return new Promise(async(resolve, reject) => {

            

            let deluser = await db.get().collection('user').findOne({_id: userId})


            console.log('inside deluser in function',deluser);

            db.get().collection('user').deleteOne({ _id: objectId(userId) }).then((response) => {


                console.log(" userId inside function",userId);
                
                resolve(userId)

            })



        })

    },

    getUserDetails: (userId) => {



        return new Promise((resolve, reject) => {

            db.get().collection('user').findOne({ _id: objectId(userId) }).then((foundUserDetails) => {

                resolve(foundUserDetails)

            })



        })





    },

    updateUser: (userId, updatedUserDetails) => {


        return new Promise((resolve,reject)=>{


        db.get().collection('user').updateOne({ _id: objectId(userId) }, { $set: { email: updatedUserDetails.email } })


        }).then(()=>{

            resolve()


        })

    


    },



//     searchUserd: (userId) => {



//         return new Promise(a(resolve, reject) => {

//             db.get().collection('user').findOne({$regex:userId}).then((foundUserDetails) => {

//                 resolve(foundUserDetails)

//             })



//         })

// }



searchUser:(value)=>{



    let values = value.seachuser
    return new Promise(async(resolve,reject)=>{


        let searchResult = await db.get().collection('user').find({email:{$regex:values}}).toArray();


        console.log(searchResult)

        resolve(searchResult)
        
    })
},


blockUser:(userId)=>{
    return new Promise(async(resolve,reject)=>{


        let user = await db.get().collection('user').findOne({_id:objectId(userId)})

        console.log("inside block user ", user);


        if(user.isActive=="Block"){

            db.get().collection('user').updateOne({_id:objectId(userId)}, {$set:{isActive:"Unblock" }}).then(data=>{


                console.log("after blocking ", user);


                resolve({blocked:true,user});


            
            }).catch(err=>{
                reject(err);
            })
        }else{



            db.get().collection('user').updateOne({_id:objectId(userId)}, {$set:{isActive:"Block"}}).then(data=>{

                resolve({blocked:false});

            }).catch(err=>{

                reject(err);
            })

        }
    })



}

}
