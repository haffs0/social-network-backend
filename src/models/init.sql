CREATE TABLE user (
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
    create_user VARCHAR(255) NOT NULL,
    user_access VARCHAR(255) NOT NULL
);

CREATE TABLE article
(
    article_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user(user_id),
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP,
    article VARCHAR(3000) NOT NULL,
    article_flag VARCHAR(255) NOT NULL,
    user_flag_id integer,
);

CREATE TABLE gifs
(
    gif_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user(user_id),
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    date TIMESTAMP,
    gif_flag VARCHAR(255) NOT NULL,
    user_flag_id integer,
);


CREATE TABLE article_comment
(
    article_comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES article(article_id),
    user_id integer NOT NULL,
    comment VARCHAR(255) NOT NULL,
    date TIMESTAMP,
    article_comment_flag VARCHAR(255) NOT NULL,
    user_flag_id integer,
);


CREATE TABLE gifs_comment
(
    gifs_comment_id SERIAL PRIMARY KEY,
    gif_id INT REFERENCES gifs(gif_id),
    user_id integer NOT NULL,
    gif_comment VARCHAR(255) NOT NULL,
    date TIMESTAMP,
    gif_comment_flag VARCHAR(255) NOT NULL,
    user_flag_id integer,
);

INSERT INTO user (first_name, last_name, email, password, gender, job_role, department,address, phone_number, role, create_user, user_access)
VALUES  ('Rowling', 'Potter', 'admin2@teamwork.com', '123456', 'male', 'developer', 'IT', 'ipaja', '090873654375', 'Admin', 'Yes', 'Yes');

INSERT INTO user (first_name, last_name, email, password, gender, job_role, department,address, phone_number, role, create_user, user_access)
VALUES  ('Rowling', 'Potter', 'john@teamwork.com', '123456', 'male', 'developer', 'IT', 'ipaja', '090873654375', 'User', '', 'Yes');
