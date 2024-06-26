const express = require('express')
const app = express()
const port = 3001
const {Server} = require('socket.io')
const connectToDatabase = require('./database')
const Book = require('./model/bookModel')
connectToDatabase()



const server = app.listen(port,()=>{
    console.log("starting server from port: "+port)
})

const io = new Server(server)

io.on('connection',(socket)=>{
    console.log( `${socket.id} user Connected !`)
    // create data to database
   
    socket.on('addBook', async(data)=>{
        try{
            console.log(data)
            if(data){
            const {bookName,bookPrice} = data
            const newBook = await Book.create({
                bookName,
                bookPrice
            })
            socket.emit("response",{
                status: 200,
                message: "Book Added Successfully",
                data: newBook
            })
            }
        }catch(err){
        socket.emit('response',{
            status: 500,
            message: `something wrong ${err}`
        })
        }

    })

    //delete book
    socket.on('deleteBook',async(data)=>{
        console.log(data._id)
        try{
        await Book.findByIdAndDelete(data._id)
        socket.emit("response",{
            status: 200,
            message: "Book deleted Successfully"
            })
        }catch(err){
            socket.emit('response',{
                status: 500,
                message: `something went wrong ${err}`
            })
        }
    })

    //read All books
    socket.on('getAllBook',async(data)=>{
        try{
            const books = await Book.find()
            if(books){
                socket.emit('response',{
                    status: 200,
                    message: "book fetched successfully",
                    data: books
                })
            }
        }catch(err){
            socket.emit('response',{
                status: 500,
                message: `Something went wrong ${err}`
            })
        }
    })

    // read one book
    socket.on('getOneBook',async(data)=>{
        try{
            const book = await Book.findById(data._id)
            if(book){
                socket.emit('response',{
                    status: 200,
                    message: "book fetched successfully",
                    data: book
                })
            }

        }catch(err){
            socket.emit('response',{
                status: 500,
                message: `Something went wrong ${err}`
            })
        }
    })


// update a book
socket.on('updateBook', async(data)=>{
    try{
        const {bookName,bookPrice} = data
        const book = await Book.findByIdAndUpdate(data._id,{
            bookName,
            bookPrice
    },{
        new:true
    })
    if(book){
        socket.emit('response',{
            status: 200,
            message: "updated Successfully",
            oldData: book,
            newData: {
                bookName,
                bookPrice
            }
        })
    }
}catch(err){
    socket.emit('response',{
        status: 500,
        message: `Something went wrong ${err}`
    })
}
})

})


// io.on('connection',(socket)=>{
//     // socket.emit('hi',{
//     //     message:"hello from server"
//     // })
//     // console.log(socket.id+ "user is connecting")
//     socket.on("sendData",(data)=>{
//         // console.log(data)
//         if(data){
//             // send notification to all user which were connected to the socket server
//             io.emit("response","data received")
//             //another method to  send response to the specific user through emit
//             io.to(socket.id).emit("response","data received by specific id")
//             // send notification for only the one which one is sending data or requesting
//             socket.emit("response","thankyou data received") 
//         }
//     })
//     socket.on("disconnect",()=>{
//         console.log(socket.id + "user is disconnecting")
//     })
// })
