var  db=require('../config/connection')
var collection=require('../config/userCollection')
const bcrypt = require('bcrypt')

module.exports={

// doSignup:(userData)=>{


// return new Promise(async(resolve,reject)=>{

//  userData.Password= await bcrypt.hash(userData.Password,10)

// db.get().collection(collection.USER_COLLECTION).insertOne(userData)
// }).resolve()  //replace this code


addUser: (user)=>{
        
    return new Promise(async(resolve,reject)=>{

        user.Pass= await bcrypt.hash(user.Pass,10)
        db.get().collection('user').insertOne(user).then((data)=>{

            console.log('from database '+ data)
            resolve(data)


        })
    })
    this.getUser
},
getUser:()=>{


    return new Promise(async(resolve,reject)=>{
        let user = await db.get().collection('user').find().toArray()
        resolve(user);
    })
}

}


// }