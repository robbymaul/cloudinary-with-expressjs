const express = require('express')
const app = express()
const port = 3000
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
require('dotenv').config() 

app.use(fileUpload({
    useTempFiles:true
}))

app.use(express.json())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
})

const upload = async (file) => {
    const image = await cloudinary.uploader.upload(file, {folder: 'arkgo'},(result) => result)

    return image
}

app.post('/upload', async (req, res) => {
    if(!req.files) return res.status(400).json({
        code: 400,
        status: "bad request",
        message: "please upload an image"
    })

    const {image} = req.files

    const cloudFile = await upload(image.tempFilePath)
    console.info(cloudFile)

    res.status(201).json({message:'Image uploaded successfully', data: cloudFile.secure_url})
})



app.listen(port, ()=> {
    console.info(`Our port running on port ${port}`)
})