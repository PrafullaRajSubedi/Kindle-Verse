import { useState, useEffect } from "react";
import { Bookmark, Heart, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const handleOpenBook = (book) => {
    navigate("/book-details", { state: { book } });
  };

  const removeBook = async (id, e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5126/api/bookmarks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from UI after deletion
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5126/api/bookmarks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBooks(response.data);
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, []);

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
                src={book.coverImagePath}
                alt={book.title}
                className="w-16 h-24 object-cover rounded-md mr-3"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <span className="text-xs text-gray-500">{book.genre}</span>
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
                  onClick={(e) => removeBook(book.id, e)}
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
