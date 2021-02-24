# User Registration Application with MySQL Database and Passport Authentication.

<p align="center">
  <img src="https://img.shields.io/badge/LICENSE-mit-green"/>

  <img src="https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/>

  <img src="https://img.shields.io/badge/express.js%20-%23404d59.svg?&style=for-the-badge"/>

  <img src="https://img.shields.io/badge/bootstrap%20-%23563D7C.svg?&style=for-the-badge&logo=bootstrap&logoColor=white"/>

  <img src="https://img.shields.io/badge/mysql-%2300f.svg?&style=for-the-badge&logo=mysql&logoColor=white"/>
</p>

## Description

This is a session handling and authentication system using CRUD (create, read, update, delete) api's in Node.js, ExpressJS, and mySQL.

### Problem

Spreadsheets are versitle powerful tools that companies use for everything from finance to marketing analytics. However, spreadsheets have its limitations, they're clunky, messy, and prone to human error.

#### The problem with using spreadsheets for your database:

1. They have security vulnerabilities. They have to be sent and shared in order for everyone in the company to access the data stored within, and that raises its own secuirity issues.
2. They are prone to human error.
3. They require more maintenance. Spreadsheets don't have a schema, meaning that they have loose rules for regulatingg how and where users input data.

Since spreadsheets tend to be more complex over time, they might not be serving your needs in the long term. Becasue of this, you may need to migrate to a more powerful type of database option - a DBMS (database management system). such as Microsoft Access or MySQL.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation

We will be using the following technologies/packages to build our application:

### Prerequisites:

1. [**Node.js**](https://nodejs.org/en/) is an implementation of the V8 JavaScript engine without Chrome that allows you to write server-side code using JavaScript. Therefore, you no longer neeed a browser to run JavaScript. You will need to have Node.js installed on your computer; you can follow the [**Node.js installation guide on The Full-Stack Blog**](https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs) to install Node.js on your computer.

2. [**ExpressJS**](https://expressjs.com/) is built on top of node.js http module, and adds provides a robust set of features for web and mobile applications.

3. [**MySQL**](https://www.mysql.com/) is a open-source relational database management system.

4. [**Postman**](https://www.postman.com/) is a development tool which helps to build, test and modify APIs.It has the ability to make various types of HTTP requests(GET, POST, PUT, PATCH etc.).

5. IDE (Integrated Development Environment) is a software application that provides comprehensive facilities to computer programmers for software development. An IDE normally consists of at least a source code editor, build automation tools, and a debugger. I prefer to use [**Visual Studio Code**](https://code.visualstudio.com/).

To install this project locally clone this [**project repository**](https://github.com/kaylamuraoka/auth-sequelize-passport-app) to create a local copy on your computer and sync between the two locations. You may then modify the code to your liking. For steps on how to clone a repository using the command line, read this section of the GitHub Docs [**about cloning a repository**](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository#about-cloning-a-repository).

You should run the following commands in the project folder.
Step 1: Initialise and configure the project with the command

```
npm init -y
```

Once you see a package.json file you can proceed to the next step.

Step 2: Install the following dependencies

1. [**express**](https://www.npmjs.com/package/express) - web framework for building the Rest API's
2. [**mailgun**](https://mailgun.com) - provides simple access to Mailgun's API for node.js applications
3. [**nodemailer**](https://www.npmjs.com/package/nodemailer) - module that makes sending emails from Node.js applications
4. [**mysql2**](https://www.npmjs.com/package/mysql2) - Node.js driver for MySQL
5. [**sequelize**](https://www.npmjs.com/package/sequelize) - promise-based Node.js ORM tool for MySQL
6. [**cloudinary**](https://www.npmjs.com/package/cloudinary) - a cloud service that offers a solution to a web application's entire image management pipeline
7. [**bcryptjs**](https://www.npmjs.com/package/bcryptjs) - ensuring a secured way to store passwords in the database by hashing passwords (converting it to a random string)

```
npm install express mailgun nodemailer mysql2 sequelize cloudinary bcryptjs --save
```

## Usage

Click [**here**](https://fukunaga-and-associates.herokuapp.com/) to view deployed application on Heroku.

## License

This project is licensed under the [**MIT**](https://opensource.org/licenses/MIT) license.

## Contributing

All comments and suggestions regarding improvements to this project are welcomed. To contribute to this project, clone this [**project repository**](https://github.com/kaylamuraoka/auth-sequelize-passport-app) locally and commit your code on a separate branch. You may then modify the code to your liking, submit well-formed pull requests and open useful issues. For steps on how to clone a repository using the command line, read this section of the Github Docs [**about cloning a repository**](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository#about-cloning-a-repository).

## Questions

Please use the contact information below if you would like to reach me with any questions:

- Github Profile: [**@kaylamuraoka**](https://github.com/kaylamuraoka)
- Email: **kmurs98@gmail.com**
