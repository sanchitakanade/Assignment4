/*
Name: Sanchita Kanade
Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
Assignment: 3
File: server.js
*/
const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const productsDB = [
  {
    id: 1, Category: 'Shirts', Name: 'Blue Shirt', Price:60.09, Image: 'https://images.google.com/',
  },
  {
    id: 2, Category: 'Jeans', Name:'Straight Fit Jeans', Price:70.10, Image:'https://images.google.com/',
  },
];

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};

//API to add product
function addProduct(_, { product }) {
  product.id = productsDB.length + 1;
  productsDB.push(product);
  return product;
}

//API to retrieve product
function productList() {
  return productsDB;
}
const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(3000, function () {
  console.log('App started on port 3000');
});