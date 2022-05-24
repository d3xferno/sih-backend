const express = require('express')
const cors = require('cors')
const knex = require('knex')

const db = knex({
    client:'pg',
    connection:{
        host:'localhost',
        user:'kage',
        password:'root',
        database:'postgres'
    }
})

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.use((req,res,next)=>{
    next()
})

app.post('/',(req,res)=>{
    const {email,password} = req.body
    console.log(email)
    console.log(password)
    db.select('email','password').from('users').where('email','=',email).
    then(data =>{
        if(password === data[0].password){
            db.select('*').from('users')
            .where('email','=',email)
            .then(user =>{
                res.json(user[0])
            })
            .catch(err =>res.json('unable to login'))
        }
        else res.json('wrong credentials')
    })
    .catch(err => res.json('wrong credentials'))
})

app.post('/register',(req,res)=>{
    const {name,email,password} = req.body
    console.log(name)
    console.log(email)
    console.log(password)    
    db('users')
    .insert({
        uname:name,
        email:email,
        password:password
    }).then(data => console.log('success'))
    .catch(err => res.json('error'))
    db.select('u_id').from('users').where('uname','=',name).then(data => res.json(data[0].u_id))
    
})

app.get('/users',(req,res)=>{
    db.select('*').from('users').then(user => {
        res.json(user)
    })
    .catch(err => res.json('error'))
})

app.get('/home/:id/profile',(req,res)=>{
    db.select('*').from('users').where('u_id','=',req.params.id)
    .then(user =>{
        res.json(user[0])
    })
})

app.listen(3001,()=>{
    console.log('SERVER ONLINE')
})