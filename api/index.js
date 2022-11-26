import express, { application } from 'express'
import mysql from 'mysql'
import * as dotenv from 'dotenv' 
import cors from 'cors'

const PORT = process.env.PORT || 8800
const app = express()
dotenv.config()


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "test"
})

//run the following query in your db if you have auth errors on connection:
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpasswordhere'

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.json("hello this is ...")
})


app.get('/books', (req,res)=>{
    const q = "SELECT * FROM books"
    db.query(q,(err, data)=>{
        
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/books', (req, res)=>{
    const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ]

    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("book has been created.")
    })
})

app.delete('/books/:id', (req, res)=>{
    const bookId = req.params.id
    const q = "DELETE FROM books WHERE id = ?"

    db.query(q, [bookId], (err, data)=>{
        if(err) return res.json(err)
        return res.json("book has been deleted.")
    })
})

app.put('/books/:id', (req, res)=>{
    const bookId = req.params.id
    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ]

    db.query(q, [...values, bookId], (err, data)=>{
        if(err) return res.json(err)
        return res.json("book has been updated.")
    })
})

app.listen(PORT, ()=>{
    console.log("connected to backend")
})