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





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jktjr9b.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {

        const bookCategoriesCollection = client.db('book-trekker').collection('book-categories');

        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = bookCategoriesCollection.find(query);
            const bookCategories = await cursor.toArray();
            res.send(bookCategories);
        });

    }
    finally {

    }

}

run().catch(err => console.error(err));




app.get('/', (req, res) => {
    res.send('Book Trekker server is running')
})

app.listen(port, () => {
    console.log(`Book Trekker server running on ${port}`);
})