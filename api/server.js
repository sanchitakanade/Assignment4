/*
Name: Sanchita Kanade
Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
Assignment: 4
File: server.js
*/
/* eslint linebreak-style: ["error", "windows"] */

const fs = require('fs');
const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://sanchita:Mayureshwar123@nodeproject-fuurm.mongodb.net/CS649FullStackDevelopment?retryWrites=true&w=majority';
const port = process.env.API_SERVER_PORT || 3000;

let db;

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate({ _id: name }, { $inc: { current: 1 } }, { returnOriginal: false });
  return result.value.current;
}
// API to add product
async function addProduct(_, { product }) {
  const newProduct = Object.assign({}, product);
  newProduct.id = await getNextSequence('productsConter');
  const result = await db.collection('inventory').insertOne(newProduct);
  const savedProduct = await db.collection('inventory')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

// API to retrieve product
async function productList() {
  const products = await db.collection('inventory').find({}).toArray();
  return products;
}

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};


async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
