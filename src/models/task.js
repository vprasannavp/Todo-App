var mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({  
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
type:Boolean,
default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})




const Tasks = mongoose.model('Tasks',userSchema)
module.exports = Tasks
