const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const addedCollection = client.db('brandShopDB').collection('added')

        //cart related api----------------------------------------------------------------
        //get cart from database
        app.get('/added', async(req, res) =>{
            const cursor = addedCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        //post cart to database
        app.post('/added', async(req, res) =>{
            const cart = req.body
            const result = await addedCollection.insertOne(cart)
            res.send(result)
        })
        //get specific cart item
        app.get('/added/:id', async(req, res) =>{
            const id = req.params.id
            const query = {
                _id: new ObjectId(id),
            }
            const result = await addedCollection.findOne(query)
            res.send(result)
        })
        //delete cart item from database
        app.delete('/added/:id', async(req, res) =>{
            const id = req.params.id 
            const query = {
                _id: new ObjectId(id),
            }
            const result = await addedCollection.deleteOne(query)
            res.send(result)
        })
        

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
        //post products to database
        app.post('/products', async(req, res) =>{
            const products = req.body
            const result = await productCollection.insertOne(products)
            res.send(result)
        })
        //get specific products from database
        app.get('/products/:id', async(req, res) =>{
            const id = req.params.id
            const query = {
                _id: new ObjectId(id),
            }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        //get specific products for updating from database
        app.get('/:id', async(req, res) =>{
            const id = req.params.id
            const query = {
                _id: new ObjectId(id),
            }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        //update the specific product in database
        app.put('/:id', async(req, res) =>{
            const id = req.params.id
            const data = req.body
            const query = {
                _id: new ObjectId(id),
            }
            const options = {upsert:true}
            const updatedProduct = {
                $set: {
                    name: data.name,
                    brand: data.brand,
                    type: data.type,
                    price: data.price,
                    image: data.image,
                    rating: data.rating
                }
            }
            const result = await productCollection.updateOne(query, updatedProduct, options)
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