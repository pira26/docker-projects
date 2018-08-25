'use strict';

const express = require("express");
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require("./config");

// Init express
const app = express();

// Init redis connection
const redis = require("redis");
const client = redis.createClient({ host: config.redisHost });

// Init MySQL Connection
const mysql = require('mysql');
const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: config.password,
  database: config.db,
  port: config.portDb,
  connectionLimit: 10
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }

  if (connection) {
    connection.release();
  }

  return;
});

client.on("error", (err) => {
  console.error("Error " + err);
});

client.set("foo", "bar", redis.print);

app.use(logger('dev'));

// Set header
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, PATCH, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }

});

// Init test routes
app.get("/", (req, res) => {
  console.log("url route '/'");
  res.send(`Hello World from : ${req.connection.localAddress}`);
});

app.get("/db", (req, res) => {
  pool.query(`SELECT * FROM Test`, (error, results, fields) => {
    if (error) {
      console.error('error in /db', error);
    } else {
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