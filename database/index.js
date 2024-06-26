const mongoose = require('mongoose')
async function connectToDatabase(){
    await mongoose.connect("mongodb+srv://aashisrijal252:FbWMkyDNnovf3Zko@cluster0.lz1hpcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
console.log("Database connected !")
}

module.exports = connectToDatabase