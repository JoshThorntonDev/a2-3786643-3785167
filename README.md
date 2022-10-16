# FWP Assignment 2 by Josh Thornton (s3786643) and Che McGee (s3785167)

React Libraries Used: Bootstrap, React-Bootstrap, React-Router-Dom, React-Bootstrap-Icons, React-Quill, React-Paginate and Axios
Express Libraries Used: Sequelize, Argon2, MySQL

Some of the React Libraries such as Bootstrap and React-Bootstrap were used for styling and layout purposes. React-Router-Dom was used for routing and navigation. React-Quill was used as our Rich Text Editor for making posts. React-Paginate was used as our pagination solution for posts, and Axios was used to call the API and interact with the DB.
As for express, MySQL was used as the DB, Sequelize was used as the ORM to interact with and declare the DB in our code, and Argon2 was used for password hashing.

To run the app, navigate to the express folder and run node server.js to start the server. Then, open another terminal in the react folder and run npm start to begin the app.
You will also need to run npm install initally to install project libraries and dependencies. Upon opening the app, you will start at the landing page, and can then access the login or sign up pages from the navbar. After logging in, the other site features will be visible in the navbar (profile, creating/viewing posts, viewing and following users). There is some data pre-seeded in the db when it is first run, that can be used for testing. For example if you want to log in without creating a new user, you could log in as first@email.com, with password password1!. 

Use of git:
We have been using git from the very beginning of the assignment. We frequently commit and push our work incrementally, multiple times a day, rather than waiting and pushing large amounts of code at one time. We created branches for each feature that we worked on so that we weren't pushing directly onto main, and we often used pull requests and checked each other's work before merging it to ensure it was bug free.

Landing page images are sourced from https://unsplash.com/images

Some code is adapted from Further Web Programming lectorial and practical course materials, such as the starter Express code (specific references mentioned in code comments)

inital create react app instructions left for reference:
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.