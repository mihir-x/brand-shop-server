const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1ny5o6u.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db('brandShopDB').collection('products')
        const userCollection = client.db('brandShopDB').collection('users')

        //user related api ---------------------------------------------------------------
        //get users data from database
        app.get('/users', async(req, res) =>{
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        //post users to database
        app.post('/users', async(req, res) =>{
            const users = req.body
            const result = await userCollection.insertOne(users)
            res.send(result)
        })



        //products related api ------------------------------------------------------------
        //get product data from database
        app.get('/products', async(req, res) =>{
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Brand Shop server is running')
})
app.listen(port, () => {
    console.log(`Brand shop server is running on port ${port}`);
})