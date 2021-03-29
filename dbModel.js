import mongoose from "mongoose"

const instance = mongoose.Schema({
    caption:String,
    user:String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    comments:[]
})

export default mongoose.model('posts' , instance)