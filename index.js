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
        const allbooksCollection = client.db('book-trekker').collection('all-books');
        const bookingCollection = client.db('book-trekker').collection('bookingCollection');


        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = bookCategoriesCollection.find(query);
            const bookCategories = await cursor.toArray();
            res.send(bookCategories);
        });

        app.get('/allbookscategory', async (req, res) => {
            const CategoryId = req.params.CategoryId;
            const query = {}
            const cursor = allbooksCollection.find(query);
            const bookCategories = await cursor.toArray();
            res.send(bookCategories);

        });

        app.get('/allbookscategory/:CategoryId', async (req, res) => {
            const CategoryId = req.params.CategoryId;
            const query = { CategoryId: CategoryId };
            const cursor = await allbooksCollection.find(query);
            const single_category = await cursor.toArray();
            res.send(single_category);

        });

        app.get('/bookings', async (req, res) => {
            // const email = req.query.email;
            // console.log(email);
            // const query = { email: email };
            // const cursor = await bookingCollection.find(query);
            // const bookings = await cursor.toArray();
            // res.send(bookings);

            const query = {}
            const cursor = bookingCollection.find(query);
            const bookCategories = await cursor.toArray();
            res.send(bookCategories);

        });


        // app.get('/bookings', async (req, res) => {
        //     // const email = req.query.email;
        //     // console.log(email);
        //     // const query = { email: email };
        //     // const cursor = await bookingCollection.find(query);
        //     // const bookings = await cursor.toArray();
        //     // res.send(bookings);

        //     const query = {}
        //     const cursor = bookingCollection.find(query);
        //     const bookCategories = await cursor.toArray();
        //     res.send(bookCategories);

        // });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })


        app.post('/allbookscategory', async (req, res) => {
            const booking = req.body;
            const result = await allbooksCollection.insertOne(booking);
            res.send(result);
        })


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