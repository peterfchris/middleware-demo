const express = require('express')
require('dotenv').config()
const session = require('express-session')
const app = express()
const {SERVER_PORT, SESSION_SECRET} = process.env


const viewCount = (req, res, next) => {
    console.log(req.session)
    if(req.session.views){
        req.session.views++
    } else {
        req.session.views = 1
    }
    next()
}

const dateLogger = (req, res, next) => {
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    console.log(`${req.method} ${req.path} ran on ${date} at ${time}`)
    next()
}

const checkAdmin = (req, res, next) => {
    const {isAdmin} = req.body
    req.session.isAdmin = isAdmin
    if(req.session.isAdmin){
        res.send(`Welcome Admin!`) 
    } else {
        res.send(`GET OUT OF HERE!`)
    }
    next()
}

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 //milliseconds * seconds * minutes, last number is the final length of a session allowed
    }
}))
app.use(express.json())
app.use(dateLogger)

app.get('/', viewCount, (req, res) => {
    res.send(`You have viewed this page ${req.session.views} times`)
})

app.get('/login', checkAdmin)
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send(`bye felicia`)
    })
})

app.listen(SERVER_PORT, () => console.log(`Magic is happening on ${SERVER_PORT}`))
