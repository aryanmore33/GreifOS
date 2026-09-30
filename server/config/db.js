// db.js
const knex = require('knex');
const knexConfig = require('./knexfile'); // Import your knexfile.js

// Determine the current environment (default to 'development')
const environment = process.env.NODE_ENV || 'development';

// Select the corresponding configuration group
const config = knexConfig[environment];

// Initialize Knex with that configuration
const db = knex(config);

module.exports = db;
