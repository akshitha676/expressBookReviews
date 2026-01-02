const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Import shared users array from auth_users.js
let { users } = require("./auth_users.js");

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if user already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    // Add new user to shared array
    users.push({ username, password });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// Get the book list
public_users.get('/', (req, res) => {
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    res.status(200).json(books[req.params.isbn]);
});

// Get book details by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let result = [];

    for (let key in books) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }
    res.json(result);
});

// Get book details by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let result = [];

    for (let key in books) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    }
    res.json(result);
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
    res.json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
