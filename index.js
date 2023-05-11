const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware.....
app.use(cors());
app.use(express.json());

// Connection MongoDB........

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

// const uri = "mongodb+srv://<username>:<password>@cluster0.wfpjg4p.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb+srv://coffeeMaster:mLA3ZcSnDvXx13la@cluster0.wfpjg4p.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfpjg4p.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffee");

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log("New newCoffee", newCoffee);

            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    qunatity: updatedCoffee.qunatity,
                    supplier: updatedCoffee.supplier,
                    teast: updatedCoffee.teast,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    url: updatedCoffee.url
                }
            }

            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);

        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("Plz delete from database: ", id);

            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
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
    res.send('Hello form Coffee Server')
})

app.listen(port, () => {
    console.log(`The news website API is runing For Coffee Server: ${port}`)
})