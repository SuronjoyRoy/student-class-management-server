const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// midlewire
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vlvvhig.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const studentCollection = client.db("studentDb").collection("teacher");
    const userCollection = client.db("studentDb").collection("users");
    const classCollection = client.db("studentDb").collection("class");


    // class related api
    app.post('/class', async(req, res) =>{
      const userData = req.body;
      const result = await classCollection.insertOne(userData);
      res.send(result)
    })
    
    // user related api
    app.post('/users', async(req, res) =>{
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.send(result)
    })
    app.get('/users/:email', async(req, res) => {
      const email= req.params.email;
      const query={email:email};
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    
    // teacher related api
    app.post('/teacher', async(req, res) =>{
      const teacherData = req.body;
      const result = await studentCollection.insertOne(teacherData);
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
  res.send('student is comming')
})


app.listen(port, () => {
  console.log(`student is getting ready ${port}`)
})
