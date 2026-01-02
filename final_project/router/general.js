const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Import shared users array from auth_users.js
let { users } = require("./auth_users.js");

// ------------------- Register a new user -------------------
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User successfully registered" });
});

// ------------------- Task 10: Get all books -------------------
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await new Promise((resolve, reject) => {
            resolve(books);
        });
        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// ------------------- Task 11: Get book by ISBN -------------------
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject(new Error("Book not found"));
        });
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// ------------------- Task 12: Get books by author -------------------
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const booksByAuthor = await new Promise((resolve) => {
            const result = Object.values(books).filter(book => book.author === author);
            resolve(result);
        });
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// ------------------- Task 13: Get books by title -------------------
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const booksByTitle = await new Promise((resolve) => {
            const result = Object.values(books).filter(book => book.title === title);
            resolve(result);
        });
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

// ------------------- Get book reviews -------------------
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const reviews = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn].reviews);
            else reject(new Error("Book not found"));
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports.general = public_users;
