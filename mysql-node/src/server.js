'use strict';

const express = require("express");
const config = require("./config");

// Init express
const app = express();

// Init MySQL Connection
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: config.get('db.host'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: config.get('db.name'),
  port: config.get('db.port')
});

connection.connect((err) => {
    if (err) {
        console.error('error during db conneciton', err);
    } else {
        console.log("You're connected to your db !");
    }
});

// Init redis connection
const redis = require("redis"),
      client = redis.createClient({ host: config.get('redis.host') });

client.on("error", (err) => {
  console.error("Error " + err);
});

client.set("foo", "bar", redis.print);

// Init test routes

app.get("/", (req, res) => {
  res.send(`Hello World from : ${req.connection.localAddress}`);
});

app.get("/db", (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      console.error('error in /db', error);
    }
    return res.json(results);
  });  
})

app.get("/redis", (req, res) => {
  client.get('foo', (err, reply) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({
      key: 'foo',
      value: reply
    });
  })
});

// Init API listening

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});