import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import Pusher from "pusher"
import dbModel from "./dbModel.js"

//app config
const app = express()
const port = process.env.PORT || 8080

const pusher = new Pusher({
  appId: "1159259",
  key: "9ee219d8486456a76325",
  secret: "9b0ca8ab420edefd2478",
  cluster: "ap2",
  useTLS: true
});


//middlewares
app.use(express.json())
app.use(cors())

//DB config
const connection_url = "mongodb://Faiz:W9t4PFYtlBEtbwV3@cluster0-shard-00-00.nteer.mongodb.net:27017,cluster0-shard-00-01.nteer.mongodb.net:27017,cluster0-shard-00-02.nteer.mongodb.net:27017/instaDB?ssl=true&replicaSet=atlas-ae7rr6-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.once("open" , () => {
    console.log("DB Connected")

    const changeStream = mongoose.connection.collection('posts').watch()

    changeStream.on('change' ,(change) =>
    {
        console.log("Change Triggered on Pusher..")
        console.log(change)
        console.log("End of Change")

        if(change.operationType === 'insert')
        {
            console.log("Triggering Pusher IMG UPLOAD")
            const postDetails = change.fullDocument
            pusher.trigger('posts' , 'inserted' , {
                user:postDetails.user,
                caption:postDetails.caption,
                image:postDetails.image
            })
        }
        else
        {
            console.log("Unknown Trigger from Pusher")
        }
    })
})


//api routes
app.get('/' , (req,res) => res.status(200).send("Hello World"))

app.post("/upload" ,(req,res) => {
    const body = req.body
    dbModel.create(body , (err,data) =>
    {
        if(err)
        {
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

app.get("/sync" , (req,res) =>
{
    dbModel.find((err,data) =>
    {
       if(err)
        {
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        } 
    })
})
//listen
app.listen(port , () => console.log(`Listening on port ${port}`))
