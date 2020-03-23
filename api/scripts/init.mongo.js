/* Name: Sanchita Kanade
   Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
   Assignment: 4
   File: init.mongo.js
*/

/* global db print */
/* eslint no-restricted-globals: "off" */
/* eslint linebreak-style: ["error", "windows"] */

db.inventory.remove({});

const productsDB = [
  {
    id: 1,
    Category: 'Shirts',
    Name: 'Blue Shirt',
    Price: 60.09,
    Image: 'https://images.google.com/',
  },
  {
    id: 2,
    Category: 'Jeans',
    Name: 'Straight Fit Jeans',
    Price: 70.10,
    Image: 'https://images.google.com/',
  },
];

db.inventory.insertMany(productsDB);
const count = db.inventory.count();
print('Inserted', count, 'items');

// here _id indicates counter's name, it's just a string
db.counters.remove({ _id: 'productsConter' });
db.counters.insert({ _id: 'productsConter', current: count });
db.issues.createIndex({ id: 1 }, { unique: true });
