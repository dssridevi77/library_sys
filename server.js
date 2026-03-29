const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const text = item.children[0].innerText.toLowerCase();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/library");

const Book = require("./Book");

// Home route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Add Book
app.post("/addBook", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.send("Book Added");
});

// View Books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Borrow Book
app.post("/borrow", async (req, res) => {
  const book = await Book.findById(req.body.bookId);

  if (!book.available) return res.send("Not Available");

  book.available = false;
  await book.save();

  res.send("Book Borrowed");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.delete("/deleteBook/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send("Book deleted successfully");
  } catch (err) {
    res.send(err);
  }
});
app.put("/updateBook/:id", async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.send("Book updated successfully");
  } catch (err) {
    res.send(err);
  }
});
