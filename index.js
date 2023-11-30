const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// midlewire
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/class/:email', async(req, res) => {
      const email= req.params.email;
      const query={email:email};
      const result = await classCollection.find(query).toArray();
      res.send(result);
      // console.log(email,'this is class email');
      // console.log('this is teacher result',result)
    })

    app.get('/update-class/:id', async(req, res) => {
      const id= req.params?.id;
      const query={_id: new ObjectId(id)};
      const result = await classCollection.findOne(query);
      res.send(result);
      // console.log(email,'this is class email');
      // console.log('this is teacher result',result)
    })

    app.get('/class/:id', async(req, res) => {
      const id= req.params?.id;
      const query={_id: new ObjectId(id)};
      const result = await classCollection.updateOne(query).toArray();
      res.send(result);
      // console.log(email,'this is class email');
      // console.log('this is teacher result',result)
    })

    app.patch('/class/:id', async(req, res) =>{
      const item = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: {
          name: item.name,
          email: item.email,
          category: item.category,
          title: item.title,
          Details: item.Details,
          price: item.price,
          photoURL: item.photoURL,
         
        }
      }
      const result =  await classCollection.updateOne(filter, updatedDoc);
      res.send(result)
    })

    app.delete('/class/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await classCollection.deleteOne(query);
    res.send(result);
})

app.get('/class', async (req, res) => {
  const result = await classCollection.find().toArray();
  res.send(result);
});

app.get('/class-single/:id', async (req, res) => {
  const id = req.params.id;
    const query = {_id: new ObjectId(id)};
  const result = await classCollection.findOne(query);
  res.send(result);
});



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

    app.get('/users-profile/:email', async(req, res) => {
      const email= req.params.email;
      const query={email:email};
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    
    app.get('/users/admin/:email', async(req, res) => {
      const email = req.params.email;

      if (email !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidden access' })
      }

      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === 'admin';
      }
      res.send({ admin });
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    // teacher related api
    app.post('/teacher', async(req, res) =>{
      const teacherData = req.body;
      const result = await studentCollection.insertOne(teacherData);
      res.send(result)
    })

    app.get('/teacher', async(req, res) => {
      const result = await studentCollection.find().toArray();
      res.send(result);
    });
    app.get('/all-class-show', async(req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    app.delete('/teacher/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await studentCollection.deleteOne(query);
      res.send(result);
  })
    app.patch('/apporove-single/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {email: email};
      console.log('user to teacher email', email);
      const updatedDoc = {
        $set:{
          role:'teacher',
        }}
      const result = await userCollection.updateOne(query,updatedDoc);
      res.send(result);
  })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
