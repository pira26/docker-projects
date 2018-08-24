'use strict';

const dotenv = require('dotenv').config();

module.exports = {
  'port': `${process.env.PORT}` || 4000,
  'mysqlHost': `${process.env.MYSQL_HOST}`,
  'user': `${process.env.MYSQL_USER}`,
  'password': `${process.env.MYSQL_ROOT_PASSWORD}`,
  'db': `${process.env.MYSQL_DATABASE}`,
  'portDb': `${process.env.MYSQL_PORT}`,
  'redisHost': `${process.env.REDIS_HOST}`,
  'appHost': `${process.env.APP_HOST}`,
  'secret': `${process.env.SECRET}`
}