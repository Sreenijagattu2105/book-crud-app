import React, { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  // GET - Fetch books
  const getBooks = async () => {
    try {
      const response = await fetch("http://localhost:3001/books");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Load books when page starts
  useEffect(() => {
    getBooks();
  }, []);

  // ADD / UPDATE BOOK
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !String(price).trim()) {
      alert("Please enter Title, Author and Price");
      return;
    }
    const bookData = {
      title: title.trim(),
      author: author.trim(),
      price: Number(price)
    };
    try {
      if (editId) {

        // UPDATE
        const response = await fetch(
          `http://localhost:3001/books/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bookData)
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update book");
        }
        alert("Book updated successfully");
      } else {

        // ADD
        const response = await fetch(
          "http://localhost:3001/books",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bookData)
          }
        );
        if (!response.ok) {
          throw new Error("Failed to add book");
        }
        alert("Book added successfully");
      }

      // Clear form
      setTitle("");
      setAuthor("");
      setPrice("");
      setEditId(null);

      // Refresh list
      getBooks();
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Something went wrong. Make sure JSON Server is running on port 3001."
      );
    }
  };

  // EDIT
  const handleEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(String(book.price));
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/books/${id}`,
        {
          method: "DELETE"
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      alert("Book deleted successfully");
      getBooks();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete book");
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setAuthor("");
    setPrice("");
  };

  return (
    <div className="book-app">
      <div className="book-container">

        {/* PAGE TITLE */}
        <h1 className="page-title">
          📚 Book Management
        </h1>

        {/* ADD BOOK SECTION */}
        <div className="form-section">
          <h2>
            {editId ? "✏️ Edit Book" : "➕ Add New Book"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="add-btn"
              >
                {editId ? "Update Book" : "Add Book"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* BOOK SHELF */}
        <div className="books-section">
          <div className="section-heading">
            <h2>📖 My Books</h2>
            <span>
              {books.length} Books
            </span>
          </div>

          {books.length === 0 ? (
            <div className="empty-books">
              No books available
            </div>
          ) : (
            <div className="bookshelf">
              {books.map((book, index) => (
                <div
                  className={`book-item book-color-${index % 5}`}
                  key={book.id}
                >
                  <div className="book-cover">
                    <div className="book-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="book-symbol">
                      📖
                    </div>
                    <h3>
                      {book.title}
                    </h3>
                    <p>
                      {book.author}
                    </p>
                    <div className="book-price">
                      ₹{book.price}
                    </div>
                  </div>

                  <div className="book-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(book)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(book.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;