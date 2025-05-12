import { Link } from "react-router-dom";
import { useState } from "react";
import { BookOpen, Search, Plus, Trash2, Edit, X, Menu } from "lucide-react";

export default function AdminBookPanel() {
  // States for the admin panel
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    isbn: "",
    publishDate: "",
    publicationLanguage: "",
    format: "",
    originalPrice: "",
    offerPrice: "",
    offerPriceDate: "",
    onSale: "no",
    stock: "",
    description: "",
    coverImage: "",
  });

  // State for file upload validation
  const [fileError, setFileError] = useState("");

  // Sample book data - in a real app, this would come from your backend
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publisher: "Scribner",
      genre: "Classic",
      isbn: "9780743273565",
      publishDate: "2004-09-30",
      publicationLanguage: "English",
      format: "Paperback",
      originalPrice: 12.99,
      price: 12.99,
      stock: 25,
      description:
        "A story of wealth, love, and the American Dream in the 1920s.",
      coverImage: "/api/placeholder/100/150",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      publisher: "HarperCollins",
      genre: "Fiction",
      isbn: "9780061120084",
      publishDate: "2006-05-23",
      publicationLanguage: "English",
      format: "Hardcover",
      originalPrice: 14.99,
      price: 14.99,
      stock: 18,
      description:
        "The story of racial injustice and the loss of innocence in the American South.",
      coverImage: "/api/placeholder/100/150",
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      publisher: "Houghton Mifflin Harcourt",
      genre: "Fantasy",
      isbn: "9780547928227",
      publishDate: "2012-09-18",
      publicationLanguage: "English",
      format: "E-Book",
      originalPrice: 10.99,
      price: 10.99,
      stock: 32,
      description:
        "A fantasy novel about the adventures of hobbit Bilbo Baggins.",
      coverImage: "/api/placeholder/100/150",
    },
  ]);

  // Dropdown options
  const genres = [
    "Fiction",
    "Non-Fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Romance",
    "Thriller",
    "Biography",
    "History",
    "Children",
    "Young Adult",
    "Self-Help",
    "Business",
    "Classic",
  ];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Chinese",
    "Japanese",
    "Russian",
    "Arabic",
    "Hindi",
    "Portuguese",
    "Dutch",
    "Korean",
    "Turkish",
  ];
  const formats = [
    "Paperback",
    "Hardcover",
    "E-Book",
    "Audiobook",
    "Large Print",
    "Board Book",
    "Spiral-bound",
    "Loose Leaf",
  ];

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookForm({ ...bookForm, [name]: value });
  };

  const handleBookSubmit = () => {
    if (editingBookId) {
      setBooks(
        books.map((book) =>
          book.id === editingBookId
            ? {
                ...bookForm,
                id: editingBookId,
                price:
                  bookForm.onSale === "yes"
                    ? bookForm.offerPrice
                    : bookForm.originalPrice,
              }
            : book
        )
      );
      setEditingBookId(null);
    } else {
      setBooks([
        ...books,
        {
          ...bookForm,
          id: Date.now(),
          price:
            bookForm.onSale === "yes"
              ? bookForm.offerPrice
              : bookForm.originalPrice,
          coverImage: "/api/placeholder/100/150",
        },
      ]);
    }

    setBookForm({
      title: "",
      author: "",
      publisher: "",
      genre: "",
      isbn: "",
      publishDate: "",
      publicationLanguage: "",
      format: "",
      originalPrice: "",
      offerPrice: "",
      offerPriceDate: "",
      onSale: "no",
      stock: "",
      description: "",
      coverImage: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const handleEditBook = (book) => {
    setBookForm({
      ...book,
      originalPrice: book.originalPrice || book.price,
      onSale: book.offerPrice ? "yes" : "no",
    });
    setEditingBookId(book.id);
    setShowAddForm(true);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-800 text-white w-64 flex-shrink-0 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex items-center justify-center h-16 border-b border-indigo-700">
          <BookOpen size={24} className="mr-2" />
          <span className="text-xl font-bold">Kindle Verse</span>
        </div>
        <nav className="mt-6">
          {["books", "orders", "customers"].map((view) => (
            <div
              key={view}
              className={`px-4 py-3 cursor-pointer hover:bg-indigo-700 ${
                activeView === view ? "bg-indigo-900" : ""
              }`}
              onClick={() => setActiveView(view)}
            >
              {view === "books"
                ? "Books"
                : view === "orders"
                ? "Announcement"
                : "Sales"}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Book Management
          </h1>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="ml-2 hidden sm:inline">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} className="mr-1" /> Add New Book
            </button>
          </div>

          {/* Book Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Book",
                      "Author",
                      "Publisher",
                      "Genre",
                      "Format",
                      "ISBN",
                      "Price",
                      "Stock",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-8 flex-shrink-0">
                              <img
                                className="h-10 w-8 rounded"
                                src={book.coverImage}
                                alt={book.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {book.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.publisher}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.genre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.format}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.isbn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${book.price}
                          {book.originalPrice > book.price && (
                            <span className="ml-2 line-through text-gray-400">
                              ${book.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No books found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingBookId ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBookId(null);
                  setBookForm({
                    title: "",
                    author: "",
                    publisher: "",
                    genre: "",
                    isbn: "",
                    publishDate: "",
                    publicationLanguage: "",
                    format: "",
                    originalPrice: "",
                    offerPrice: "",
                    offerPriceDate: "",
                    onSale: "no",
                    stock: "",
                    description: "",
                    coverImage: "",
                  });
                  setFileError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Book Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter book title"
                  />
                </div>
                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter author name"
                  />
                </div>
                {/* Publisher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={bookForm.publisher}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter publisher"
                  />
                </div>
                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={bookForm.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Publication Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Language
                  </label>
                  <select
                    name="publicationLanguage"
                    value={bookForm.publicationLanguage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Language</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    name="format"
                    value={bookForm.format}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Format</option>
                    {formats.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={bookForm.isbn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter ISBN"
                  />
                </div>
                {/* Publication Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={bookForm.publishDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={bookForm.originalPrice || ""}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
                {/* On Sale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book on Sale
                  </label>
                  <div className="flex space-x-4 mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="onSale"
                        value="yes"
                        checked={bookForm.onSale === "yes"}
                        onChange={handleInputChange}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="onSale"
                        value="no"
                        checked={bookForm.onSale === "no"}
                        onChange={handleInputChange}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={bookForm.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
                {/* Offer Price & Date */}
                {bookForm.onSale === "yes" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Price ($)
                      </label>
                      <input
                        type="number"
                        name="offerPrice"
                        value={bookForm.offerPrice || ""}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer End Date
                      </label>
                      <input
                        type="date"
                        name="offerPriceDate"
                        value={bookForm.offerPriceDate || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}
                {/* Cover Image */}
                <div
                  className={bookForm.onSale === "yes" ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-36 bg-gray-100 border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      {bookForm.coverImage ? (
                        <img
                          src={bookForm.coverImage}
                          alt="Book cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col space-y-2">
                        <label className="flex flex-col items-center px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-600 cursor-pointer hover:bg-indigo-50 transition">
                          <span className="text-sm font-medium">
                            Choose file
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                setFileError("File size exceeds 2MB limit");
                                return;
                              }
                              if (
                                ![
                                  "image/jpeg",
                                  "image/png",
                                  "image/gif",
                                ].includes(file.type)
                              ) {
                                setFileError(
                                  "Only JPG, PNG, and GIF files are allowed"
                                );
                                return;
                              }
                              setFileError("");
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBookForm({
                                  ...bookForm,
                                  coverImage: reader.result,
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {bookForm.coverImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setBookForm({ ...bookForm, coverImage: "" })
                            }
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove image
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload a JPG, PNG or GIF image (max 2MB).
                      </p>
                      {fileError && (
                        <p className="text-xs text-red-600 mt-1">{fileError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={bookForm.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter book description"
                />
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBookId(null);
                    setFileError("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingBookId ? "Update Book" : "Add Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
