const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require('dotenv').config();

const db = require('./config/db');
const initializePassport = require("./config/passport");

const port = 8000;

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Origin", "Cache-Control", "X-Requested-With"],
    credentials: true, 
    optionsSuccessStatus: 200, 
    maxAge: 86400
}));

app.use(express.json());

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: "session"
    }),
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

initializePassport(app, passport);

app.use('/api/hod', require('./routes/hod'));
app.use('/api/student', require('./routes/student'));
app.use('/api/dean', require('./routes/dean'))
app.use('/api/crpc', require('./routes/crpc'));
app.use('/api/student/noc', require("./routes/noc"));

app.get("/message", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(port, (err) => {
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is live on port: ${port}`);
})