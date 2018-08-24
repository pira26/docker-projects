'use strict';

const express = require("express");
const config = require("./config");

// Init express
const app = express();

// Init redis connection
const redis = require("redis");
const client = redis.createClient({ host: config.redisHost });

// Init MySQL Connection
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: config.mysqlHost,
  user: config.user,
  password: config.password,
  database: config.db,
  port: config.portDb
});

connection.connect((err) => {
    if (err) {
        console.error('error during db connection', err);
    } else {
        console.log("You're connected to your db !");
    }
});

// client.on("error", (err) => {
//   console.error("Error " + err);
// });

client.set("foo", "bar", redis.print);

// Init test routes

app.get("/", (req, res) => {
  console/log("url route '/'");
  res.send(`Hello World from : ${req.connection.localAddress}`);
});

app.get("/db", (req, res) => {
  connection.query(`SELECT * FROM Test`, (error, results, fields) => {
    if (error) {
      console.error('error in /db', error);
    } else {
      console.log('results -> ', results);
      console.log('fieds ==> ', fields);
      return res.json(results);
    }
  });  
})

app.get("/redis", (req, res) => {
  client.get('foo', (err, reply) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.json({
        key: 'foo',
        value: reply
      });
    }
  })
});

// Init API listening

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}!`);
});