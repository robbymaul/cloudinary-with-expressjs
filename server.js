const express = require('express')
const app = express()
const port = 3000
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const {Upload} = require('./models')
const fs = require('fs')
require('dotenv').config()

app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
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
    console.info(cloudFile.secure_url)

    
    try {
        // kita harus mendapatkan request param id
        const createFile = await Upload.create({
            image: cloudFile.secure_url
        }) 


        fs.unlinkSync(image.tempFilePath) // delete image after create upload file in database

        const result = {
            status: "oke",
            data: createFile
        }

        res.status(200).json(result)
    } catch (error) {
        console.log(error, "not found")
    }

})



app.listen(port, ()=> {
    console.info(`Our port running on port ${port}`)
})