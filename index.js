const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());


//console.log(process.env.DB_User)
//console.log(process.env.DB_Password)






app.get('/', (req, res) => {
    res.send('Book Trekker server is running')
})

app.listen(port, () => {
    console.log(`Book Trekker server running on ${port}`);
})