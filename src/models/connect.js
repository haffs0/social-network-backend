const { Pool } = require('pg');
const envConfig = require('../helpers/env-config');



const connectionString = `postgresql://${envConfig.USER}:${envConfig.PASSWORD}@${envConfig.HOST}:${envConfig.POSTGRESPORT}/${envConfig.DATABASE}`

const pool = new Pool({
  connectionString: envConfig.isTest ? envConfig.DATABASE_URL : connectionString,
  ssl: envConfig.isTest,
})

module.exports = pool;