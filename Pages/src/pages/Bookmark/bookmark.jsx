import { useState } from "react";
import { Bookmark, Heart, Trash2 } from "lucide-react";
import BookDetail from "../Bookdetails/BookDetails.jsx";
const mockBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    image: "/api/placeholder/80/120",
    publishYear: "1925",
    pages: 218,
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age...",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    image: "/api/placeholder/80/120",
    publishYear: "2018",
    pages: 320,
    description:
      "Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies...",
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    category: "Sci-Fi",
    image: "/api/placeholder/80/120",
    publishYear: "1965",
    pages: 412,
    description:
      "Dune is a 1965 science fiction novel by American author Frank Herbert. It is the first installment of the Dune saga...",
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    image: "/api/placeholder/80/120",
    publishYear: "1937",
    pages: 310,
    description:
      "The Hobbit is a children's fantasy novel by J.R.R. Tolkien, published in 1937 to wide critical acclaim...",
  },
];

export default function BookWishlistUI() {
  const [books, setBooks] = useState(mockBooks);
  const [selectedBook, setSelectedBook] = useState(null);

  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const handleOpenBook = (book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  if (selectedBook) {
    return <BookDetail book={selectedBook} onBack={handleBack} />;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Book Wishlist</h1>
        <Bookmark className="text-indigo-600" size={24} />
      </div>

      <div className="space-y-3">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.id}
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOpenBook(book)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-16 h-24 object-cover rounded-md mr-3"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <span className="text-xs text-gray-500">{book.category}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart size={18} fill="currentColor" />
                </button>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBook(book.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No books in your wishlist
          </div>
        )}
      </div>

      {books.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          {books.length} books saved
        </div>
      )}
    </div>
  );
}
