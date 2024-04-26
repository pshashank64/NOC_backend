const mongoose = require('mongoose');

const user = process.env.user;
const pass = process.env.pass;

// const url = `mongodb+srv://${user}:${pass}@cluster0.j6wqe7q.mongodb.net/`;
const url = `mongodb+srv://${user}:${pass}@cluster0.r59s1c4.mongodb.net/`

mongoose.connect(url).then(() => console.log("Connected to db!")).catch((err) => console.log("Error in connecting db: ", err));
