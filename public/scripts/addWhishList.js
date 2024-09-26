const User = require('../../models/users');
const jwt = require('jsonwebtoken')
const WL = document.getElementById('addToWhishList')

//const num = document.getElementById('cantidad')

const id = document.getElementById('id')

//const data =  num 

const codID = req.cookies['accessToken'];
const decodedInfo = jwt.verify(codID, process.env.SECRETKEY)

console.log('whishList Script!!!!')
console.log('coded ID--->  ', codID)
console.log('decoded INFO--->  ', decodedInfo.id)


WL.addEventListener("click", ()=>{

    console.log('click')

User.update({
    $push: {
        WishList: id
      }
},{where: { id: decodedInfo.id}})

})
