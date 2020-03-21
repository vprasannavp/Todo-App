const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../../middleware/auth')
router.post('/task',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user.id
    })
    try {

        await task.save()
        await  res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)    
    }
    
       })
    
    
    
    
    
    router.get('/task',auth,async(req,res)=>{
      const match = {}
      const sort = {}
      if(req.query.completed){
          match.completed = req.query.completed === 'true'
      }
      if(req.query.sort){
var parts = req.query.sort.split(':')
sort [parts[0]] = parts[1] === 'desc' ? -1 : 1

      }
    try {
        console.log(sort)
        await req.user.populate({
            path : 'tasks',
            match,
            options:{ 
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort 
            }
        }).execPopulate()
        await res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
    
    })
    
    router.get('/task/:id',auth,async(req,res) =>    {
    const _id = req.params.id
    try {
        
   const task = await Task.findOne({_id,owner:req.user._id})
    //    var task =  await Task.find({_id})
        if(!task){
            return res.status(404).send()
        }
    res.send(task)
    
    } catch (e) {
        res.send(500).send()
    }
    
    
     
    
    })
    
    
    router.patch('/task/:id',auth,async(req,res) => {
     
        const updates = Object.keys(req.body) 
 
        const validItems = ['completed','description'];
        const checkValid = updates.every((update) => validItems.includes(update) )
    if(!checkValid){
        return res.status(400).send({error:"invalid input"})
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const tasks = await Task.findOne({_id : req.params.id , owner : req.user._id})
        if(!tasks){
            return res.status(404).send()
        }
        updates.forEach((task) => {
            console.log( tasks[task])
            console.log(req.body[task])
           tasks[task] = req.body[task]
        })

await tasks.save()
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
    
     
    })
    
    
    
    router.delete('/task/:id',auth,async(req,res)=>{
        try {
            const task = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id })
            if(!task){
               return res.status(404).send("no task found")
            }
         res.send(task)    
        } catch (e) {
            res.status(500).send(e)     
        }
        })

        module.exports = router