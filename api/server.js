/*
Name: Sanchita Kanade
Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
Assignment: 3
File: server.js
*/
const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://sanchita:Mayureshwar123@nodeproject-fuurm.mongodb.net/CS649FullStackDevelopment?retryWrites=true&w=majority';

let db;

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};

//API to add product
async function addProduct(_, { product }) {
  product.id = await getNextSequence('productsConter');
  const result = await db.collection('inventory').insertOne(product);
  const savedProduct = await db.collection('inventory')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

//API to retrieve product
async function productList() {
  const products = await db.collection('inventory').find({}).toArray();
  return products;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

async function getNextSequence(name) {  
  const result = await db.collection('counters')
  .findOneAndUpdate({ _id: name }, { $inc: { current: 1 } }, { returnOriginal: false },);
  return result.value.current;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
// app.listen(3000, function () {
//   console.log('App started on port 3000');
// });

(async function() {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  }catch (err) {
    console.log('ERROR:', err);
  }
})();
