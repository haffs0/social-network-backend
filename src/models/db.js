/* eslint-disable no-console */
require('dotenv').config();

const pool = require('./connect');

/**
 * Create Users Table
 */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      user(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(255) NOT NULL,
        job_role VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        create_user VARCHAR(255),
        user_access VARCHAR(255) NOT NULL
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/*
  Create Articles table
*/
const createArticlesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
      article(
        article_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES user(user_id),
        title VARCHAR(255) NOT NULL,
        date TIMESTAMP,
        article VARCHAR(3000) NOT NULL,
        article_flag VARCHAR(255) NOT NULL,
        user_flag_id integer,
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/*
  Create gifs table
*/
const createGifsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      gifs(
        gif_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES user(user_id),
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        date TIMESTAMP,
        gif_flag VARCHAR(255) NOT NULL,
        user_flag_id integer,
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/*
  Create Article comments
*/
const createArticleCommentsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      article_comment(
        article_comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES article(article_id),
        user_id integer NOT NULL,
        comment text,
        date TIMESTAMP,
        article_comment_flag VARCHAR(255) NOT NULL,
        user_flag_id integer,
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const creategifCommentsTable = () => {
    const queryText = `CREATE TABLE IF NOT EXISTS
        gifs_comment(
            gifs_comment_id SERIAL PRIMARY KEY,
            gif_id INT REFERENCES gifs(gif_id),
            user_id integer NOT NULL,
            gif_comment VARCHAR(255) NOT NULL,
            date TIMESTAMP,
            gif_comment_flag VARCHAR(255) NOT NULL,
            user_flag_id integer,
        )`;
  
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };
/*
  Init Data
*/
const insertInitData = () => {
  const queryText = `INSERT INTO user (first_name, last_name, email, password, gender, job_role, department,address, phone_number, role, create_user, user_access) VALUES  ('Rowling', 'Potter', 'admin2@teamwork.com', '123456', 'male', 'developer', 'IT', 'ipaja', '090873654375', 'Admin', 'Yes', 'Yes')`

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS user returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


/**
 * Drop Articles Table
 */
const dropArticlesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS article returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Gifs Table
 */
const dropGifsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS gifs returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Article comments Table
 */
const dropArticleCommentsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS article_comment returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Article comments Table
 */
const dropgifsCommentsTable = () => {
    const queryText = 'DROP TABLE IF EXISTS gifs_comment returning *';
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUsersTable();
  createArticlesTable();
  createGifsTable();
  createArticleCommentsTable();
  creategifCommentsTable();
  insertInitData();
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
  dropArticlesTable();
  dropGifsTable();
  dropArticleCommentsTable();
  dropgifsCommentsTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createAllTables,
  createUsersTable,
  createArticlesTable,
  createGifsTable,
  createArticleCommentsTable,
  creategifCommentsTable,
  insertInitData,
  dropAllTables,
  dropUserTable,
  dropArticlesTable,
  dropGifsTable,
  dropArticleCommentsTable,
  dropgifsCommentsTable,
};

require('make-runnable');
