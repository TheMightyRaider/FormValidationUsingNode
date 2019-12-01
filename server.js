const express = require('express')
const mongoose= require('mongoose')
const body_parser=require('body-parser')
const path=require('path')
const fs=require('fs')
const { Schema } = mongoose


mongoose.connect('mongodb://localhost:27017/assignment',()=>{
    console.log('Connected to the Database')
})

const Details= new Schema({
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please fill a valid email address',
        ],
      },
    CollegeId:{type:String, required:true},
    CollegeName:{type:String, required:true},
    ContactNumber:{type:Number, required:true},
    Track:{
        type:String,
        enum: ['react', 'java&mysql','node & Mongo db','python and ml'],
        lowercase:true,
        required:true
      },
    Image:{
        required:true,
        type:Buffer,
      }
})

UserDetails=mongoose.model('formdetails',Details)

const app = express()

app.use(express.static(path.join(__dirname,'public')))
app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json())

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('Connected to '+port)
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/main.html'))
    // res.sendFile("main.html")
})

app.post('/post',(req,res)=>{
    var base64=req.body.Image.toString('base64')
    const formdetails=new UserDetails({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email:req.body.email,
        CollegeId:req.body.CollegeId,
        CollegeName:req.body.CollegeName,
        ContactNumber:req.body.ContactNumber,
        Track:req.body.Track, 
        Image:base64,

    })
    .save()
    .then(_=>{
        res.send('Uploaded')
    })
    .catch(err=>{
        res.send('Upload Failed')
        console.log(err)
    })
 
})

// Not working !

app.get('/:imageid',(req,res)=>{
    UserDetails.findById(req.params.imageid)
    .select({
        Image:1
    })
    .then(image=>{
        // var binaryvalue=fs.writeFileSync(image)
        res.send(image)
    })
    .catch(err=>{
        if(err)
        res.send('Whats the error ?'+err)
    })
})