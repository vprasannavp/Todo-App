require('./mongoose');
const Task  = require('../models/task');

// Task.findOneAndDelete({ _id : '5e56b26829630e19349afed1' }).then((task)=>{
// console.log(task)
// return Task.find({completed : false})
// }).then((task)=>{
// console.log(task);
// }).catch((err)=>{
//     console.log(err)
// })

 deleteTaskAndCount = async(_id) =>{
await Task.findOneAndDelete({ _id  })
var docNo = await Task.countDocuments({completed : false})
return docNo
}
deleteTaskAndCount('5e580a63147f902f2891dd44').then((task) => {
console.log(task);
    }).catch((e) => {
        console.log(e);
    })
