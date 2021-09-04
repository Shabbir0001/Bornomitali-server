const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvezx.mongodb.net/bumbleBee?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





app.get('/', (req, res) => {
  res.send('Hello Bornomitali Server!')
})




// product collection
client.connect(err => {
  const productsCollection = client.db("bumbleBee").collection("products");

  app.post('/addProduct', (req, res)=>{
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.acknowledged === true)
    })
  })

  app.get('/products', (req, res)=> {
    productsCollection.find({})
    .toArray((error, items) => {
      res.send(items);
    })
  })

  app.delete('/deleteProduct/:id', (req, res)=>{
    const id = ObjectId(req.params.id);
    productsCollection.deleteOne({_id: id})
    .then(documents => res.send(documents))
  })

  app.patch('/editProduct/:id', (req, res)=>{
    const id = ObjectId(req.params.id);
    productsCollection.updateOne({_id: id}, 
        {
          $set: {name: req.body.name, price: req.body.price, imageURL: req.body.imageURL}
        }
      )
      .then(result =>{
        res.send(result.modifiedCount > 0)
      })
  })

  // client.close();
});



// user collection
client.connect(err => {
  const userCollection = client.db("bumbleBee").collection("user");

  app.post('/addUser', (req, res)=>{
    const newUser = req.body;
    userCollection.insertOne(newUser)
    .then(result =>{
        res.send(result.acknowledged === true)
    })
  })

});



// orders collection
client.connect(err => {
  const ordersCollection = client.db("bumbleBee").collection("orders");

  app.post('/addOrder', (req, res)=>{
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.acknowledged === true)
    })
  })

  app.get('/orders/:userEmail', (req, res) => {
    const userEmail = req.params.userEmail;
    ordersCollection.find({email: userEmail})
    .toArray((err, data) =>{
      res.send(data)
    })
  })

})


app.listen(process.env.PORT || port)