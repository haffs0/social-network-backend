/* eslint-disable no-console */
require('dotenv').config();

const pool = require('./connect');

/**
 * Create Users Table
 */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      public.user(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(120) UNIQUE,
        password VARCHAR(255),
        gender VARCHAR(255),
        job_role VARCHAR(255),
        department VARCHAR(255),
        address VARCHAR(255),
        phone_number VARCHAR(255),
        role VARCHAR(255),
        create_user VARCHAR(255),
        user_access VARCHAR(255)
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
  public.article(
        article_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES public.user(user_id),
        title VARCHAR(255),
        date TIMESTAMP,
        article VARCHAR(3000),
        article_flag VARCHAR(255),
        user_flag_id integer
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
  public.gifs(
        gif_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES public.user(user_id),
        title VARCHAR(255),
        image_url VARCHAR(255),
        date TIMESTAMP,
        gif_flag VARCHAR(255),
        user_flag_id integer
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
  public.article_comment(
        article_comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES public.article(article_id),
        user_id integer,
        comment text,
        date TIMESTAMP,
        article_comment_flag VARCHAR(255),
        user_flag_id integer
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
    public.gifs_comment(
            gifs_comment_id SERIAL PRIMARY KEY,
            gif_id INT REFERENCES public.gifs(gif_id),
            user_id integer,
            gif_comment VARCHAR(255),
            date TIMESTAMP,
            gif_comment_flag VARCHAR(255),
            user_flag_id integer
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
  const queryText = `INSERT INTO public.user (first_name, last_name, email, password, gender, job_role, department,address, phone_number, role, create_user, user_access) VALUES  ('Rowling', 'Potter', 'admin2@teamwork.com', '123456', 'male', 'developer', 'IT', 'ipaja', '090873654375', 'Admin', 'Yes', 'Yes')`

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
  const queryText = 'DROP TABLE IF EXISTS public.user returning *';
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
  const queryText = 'DROP TABLE IF EXISTS public.article returning *';
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
  const queryText = 'DROP TABLE IF EXISTS public.gifs returning *';
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
  const queryText = 'DROP TABLE IF EXISTS public.article_comment returning *';
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
    const queryText = 'DROP TABLE IF EXISTS public.gifs_comment returning *';
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
  dropArticleCommentsTable();
  dropgifsCommentsTable();
  dropUserTable();
  dropArticlesTable();
  dropGifsTable();
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
