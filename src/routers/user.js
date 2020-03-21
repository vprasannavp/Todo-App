const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../../middleware/auth')
const {sendWelcomeEmail} = require('../emails/account')
const {sendRemoveEmail} = require('../emails/account')
const multer = require('multer')
const sharp = require('sharp')

router.post('/users',async(req,res)=>{

    try {
        const user = await new User(req.body)
        const token = await user.generateAuthToken()  
        await user.save()
        sendWelcomeEmail(user.email, user.name)    
        await res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e); 
    }
    
    })


    router.post('/user/login',async (req,res) => {
try{
    const user = await User.findByCredentials(req.body.email , req.body.password)
    const token = await user.generateAuthToken() 
        res.send({user,token})
} catch(e) {
res.status(400).send(e)
}
    } )

    
    router.post('/users/logout',auth ,async (req,res) => {
try{
req.user.tokens = req.user.tokens.filter((token) => {
    return token.token !== req.token
} )
await req.user.save()
res.send()
}catch(e){
res.status(500).send( )
}
    })

    router.post('/users/logoutall',auth ,async (req,res) => {
        try{
  req.user.tokens = []

        await req.user.save()
        res.send()
        }catch(e){
        res.status(500).send( )
        }
            })

    router.get('/users/me' ,auth, async(req,res)=>{
    //     try {
    //      const user = await User.find({})
    //      if(!user){
    //          return res.status(404).send()
    //      }
    //   res.send(user)
    //     } catch (e) {
            
    //  res.status(500).send(e)
    //     }  
    res.send(req.user)
    })


     router.patch('/users/me',auth ,async(req,res) => {
        const updates = Object.keys(req.body) 
  console.log(updates)
//  console.log(req.user)
        const validItems = ['name','email','age','password'];
        const checkValid = updates.every((update) => validItems.includes(update) )
    
        if(!checkValid){
            return res.status(404).send({error:"Invalid Items"})
        }
        
        try {
            // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true , runValidators:true})
            const user = await User.findById(req.user._id)
            updates.forEach((update)=>{
user[update] = req.body[update]  
            })
     
await user.save()

          
            return res.send(user)

        res.send(user)
        } catch (e) {
          res.status(400).send(e)  
        }
    })
    const upload = multer({
 
        limits : {
            fileSize:1000000
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(new Error("Please Upload a proper image format"))
            }
            cb(undefined,true)
        }
    })
router.post('/user/me/avatar',auth,upload.single('avatar') , async(req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
          res.send()
},(err,req,res,next) => {
    res.status(400).send({error:err.message})
})

router.delete('/user/me/avatar',auth, async(req,res) => {
 req.user.avatar = undefined
    await req.user.save()
          res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
})



    router.delete('/user/me',auth,async(req,res)=>{
        try {
         await req.user.remove()
         sendRemoveEmail(req.user.email, req.user.name)   
         res.send(req.user)    
        
        } catch (e) {
            res.status(500).send(e)     
        }
        })
        

module.exports = router