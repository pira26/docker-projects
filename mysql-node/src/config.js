'use strict';

const  convict = require('convict');
const fs = require('fs');

// Define a schema
const config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 4000,
        env: "PORT",
        arg: "port"
    },
    db: {
        host: {
            doc: "Database host name/IP",
            format: '*',
            default: 'db',
            env: 'MYSQL_HOST'
        },
        name: {
            doc: "Database name",
            format: String,
            default: 'database',
            env: 'MYSQL_NAME'
        },
        user: {
            doc: "Database username",
            format: String,
            default: 'root',
            env: 'MYSQL_USER'
        },
        password: {
            doc: "Database password",
            format: String,
            default: 'password',
            env: 'MYSQL_PASSWORD'
        },
        port: {
            doc: "Database port",
            format: 'port',
            default: 3306,
            env: 'MYSQL_PORT'
        }
    },
    redis: {
        host: {
            doc: "Redis host",
            format: String,
            default: 'redis',
            env: 'REDIS_HOST'
        },
    }
});

// Load environment dependent configuration
const env = config.get('env');
const envFile = './config/' + env + '.json'
if (fs.existsSync(envFile)) {
    config.loadFile(envFile);
}

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;