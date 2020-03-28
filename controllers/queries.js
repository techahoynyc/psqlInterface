'use strict';

const { loggers } = require('winston')
const logger = loggers.get(process.env.LOGGER_NAME)

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: 'localhost',
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

exports.getHome = function(req, res) {
  pool.query('SELECT * from '+process.env.TABLE_NAME+' ORDER BY '+process.env.UNIQUE_ID+' ASC', (error, results) => {
    if (error) {
      logger.error(error)
    }
    var data = results.rows;
    
    //console.log(data);
    res.render('home', { contentList:data,title:'Table_Title' });
  });
};
