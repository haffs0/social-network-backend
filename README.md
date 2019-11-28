# social-network-backend
[![Build Status](https://travis-ci.org/haffs0/social-network-backend.svg?branch=develop)](https://travis-ci.org/haffs0/social-network-backend) [![Coverage Status](https://coveralls.io/repos/github/haffs0/social-network-backend/badge.svg?branch=develop)](https://coveralls.io/github/haffs0/social-network-backend?branch=develop) [![Test Coverage](https://api.codeclimate.com/v1/badges/90b43cb9d1ef5e30f68c/test_coverage)](https://codeclimate.com/github/haffs0/social-network-backend/test_coverage)


# Internal Social NetWork - Facilitate more interaction between colleagues and promote team bonding.

---
# Setup Dotenv

#### A .env file is used to store configuration files especialy about development and testing.

#### Guide to use dotenv in this project

- Install dotenv package as a project dependency using "npm install dotenv" or "yarn add dotenv"
- Create .env file in project root directory.
- Add environment variables to .env file as seen in the .env.example file in the root folder.

## Project top-level directory structure

```    
src
    ├── controllers
    ├── helpers                   # reusable functions across the project
    ├── middlewares                 # route validation functions
    ├── models                      # database connection
    ├── routes.js               # general routes for all modules
    └── tests                       # integration test files
    
  ```





















