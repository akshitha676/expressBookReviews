const express = require('express');
const books = require("./booksdb.js"); // in-memory book database
const public_users = express.Router();

// Import shared users array from auth_users.js
let { users } = require("./auth_users.js");

/**
 * Task 6: Register a new user
 */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered" });
});

/**
 * Task 10: Get list of all books (async/await)
 */
public_users.get("/", async (req, res) => {
    try {
        // No need for Promise since data is in memory
        const allBooks = Object.values(books);
        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

/**
 * Task 11: Get book details by ISBN (async/await)
 */
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

/**
 * Task 12: Get books by Author (async/await, case-insensitive)
 */
public_users.get("/author/:author", async (req, res) => {
    try {
        const authorParam = req.params.author.toLowerCase();

        const booksByAuthor = Object.values(books).filter(
            book => book.author.toLowerCase() === authorParam
        );

        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

/**
 * Task 13: Get books by Title (async/await, case-insensitive)
 */
public_users.get("/title/:title", async (req, res) => {
    try {
        const titleParam = req.params.title.toLowerCase();

        const booksByTitle = Object.values(books).filter(
            book => book.title.toLowerCase() === titleParam
        );

        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

/**
 * Get book reviews by ISBN
 */
public_users.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book.reviews);
});

module.exports.general = public_users;
