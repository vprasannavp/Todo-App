const express = require('express')
require('./db/mongoose');
const User = require('./models/user')
const Task = require('./models/task')
const app = express()
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const port = process.env.PORT 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port , ()=>{
    console.log("Server is up on Port"+port); 
})