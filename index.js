const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());

//old

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

//new
// function verifyJWT(req, res, next) {

//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('unauthorized access');
//     }

//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     })

// }





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
        const usersCollection = client.db('book-trekker').collection('usersCollection');
        const usersCollection2 = client.db('book-trekker').collection('usersCollection2');


        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })


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


        //all orders

        app.get('/allbookings', async (req, res) => {

            const query = {}
            const cursor = bookingCollection.find(query);
            const mybook = await cursor.toArray();
            res.send(mybook);

        });

        //specific email orders

        app.get('/bookings', async (req, res) => {


            const query = { email: req.query.email }
            const cursor = bookingCollection.find(query);
            const mybook = await cursor.toArray();
            res.send(mybook);

        });

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



        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });


        //alluser


        app.get('/allusers', async (req, res) => {

            const query = {}
            const cursor = usersCollection.find(query);
            const mybook = await cursor.toArray();
            res.send(mybook);

        });

        //specific users filtered with email


        app.get('/users', async (req, res) => {

            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = await usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);


        });

        //specific users  usertype - Buyer -Seller

        app.get('/userstype', async (req, res) => {


            const query = { usertype: req.query.usertype }
            const cursor = usersCollection.find(query);
            const mybook = await cursor.toArray();
            res.send(mybook);

        });


        app.put('/allusers/seller/:id', verifyJWT, async (req, res) => {

            // const decodedEmail = req.decoded.email;
            // const query = { email: decodedEmail };
            // const user = await usersCollection.findOne(query);

            // if (user?.role !== 'admin') {
            //     return res.status(403).send({ message: 'forbidden access' })
            // }

            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'seller'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })



        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            // TODO: make sure you do not enter duplicate user email
            // only insert users if the user doesn't exist in the database
            const result = await usersCollection.insertOne(user);
            res.send(result);
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