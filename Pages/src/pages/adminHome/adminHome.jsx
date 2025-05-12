// src/pages/adminHome/adminHome.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Search,
    Plus,
    Trash2,
    Edit,
    X,
    Menu,
    LogOut,
} from "lucide-react";

const API_BASE = "http://localhost:5150/api/admin";

export default function AdminHome() {
    const navigate = useNavigate();

    // UI state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);

    // Form state
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

    // Books list in PascalCase shape
    const [books, setBooks] = useState([]);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: API_BASE,
        headers: { Authorization: `Bearer ${token}` },
    });

    // Normalize server JSON (camelCase) → your PascalCase fields
    const normalize = (b) => ({
        Id: b.Id ?? b.id,
        Title: b.Title ?? b.title,
        Author: b.Author ?? b.author,
        Publisher: b.Publisher ?? b.publisher,
        Genre: b.Genre ?? b.genre,
        ISBN: b.ISBN ?? b.isbn,
        Format: b.Format ?? b.format,
        Language: b.Language ?? b.language,
        PublicationDate: b.PublicationDate ?? b.publicationDate,
        Price: b.Price ?? b.price,
        Discount: b.Discount ?? b.discount,
        Stock: b.Stock ?? b.stock,
        Description: b.Description ?? b.description,
        IsOnSale: b.IsOnSale ?? b.isOnSale,
        DiscountStartDate: b.DiscountStartDate ?? b.discountStartDate,
        DiscountEndDate: b.DiscountEndDate ?? b.discountEndDate,
        CoverImagePath: b.CoverImagePath ?? b.coverImagePath,
    });

    // Load books on mount
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/manage-books");
                setBooks(Array.isArray(data) ? data.map(normalize) : []);
            } catch {
                navigate("/admin/login");
            }
        })();
    }, [api, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookForm((f) => ({ ...f, [name]: value }));
    };

    const makeDto = () => ({
        Title: bookForm.title,
        Author: bookForm.author,
        ISBN: bookForm.isbn,
        Description: bookForm.description,
        Format: bookForm.format,
        Language: bookForm.publicationLanguage,
        Genre: bookForm.genre,
        Publisher: bookForm.publisher,
        PublicationDate: bookForm.publishDate,
        Price:
            bookForm.onSale === "yes"
                ? parseFloat(bookForm.offerPrice)
                : parseFloat(bookForm.originalPrice),
        Stock: parseInt(bookForm.stock, 10),
        Discount:
            bookForm.onSale === "yes"
                ? parseFloat(bookForm.originalPrice) - parseFloat(bookForm.offerPrice)
                : null,
        IsOnSale: bookForm.onSale === "yes",
        DiscountStartDate:
            bookForm.onSale === "yes" ? bookForm.offerPriceDate : null,
        DiscountEndDate:
            bookForm.onSale === "yes" ? bookForm.offerPriceDate : null,
        CoverImagePath: bookForm.coverImage,
    });

    const handleBookSubmit = async () => {
        try {
            const dto = makeDto();
            if (editingBookId !== null) {
                await api.put(`/update-book/${editingBookId}`, dto);
            } else {
                await api.post("/create-book", dto);
            }
            const { data } = await api.get("/manage-books");
            setBooks(Array.isArray(data) ? data.map(normalize) : []);
            // reset form
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
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        try {
            await api.delete(`/delete-book/${id}`);
            setBooks((bs) => bs.filter((b) => b.Id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditBook = (b) => {
        setBookForm({
            title: b.Title,
            author: b.Author,
            publisher: b.Publisher,
            genre: b.Genre,
            isbn: b.ISBN,
            publishDate: b.PublicationDate.split("T")[0],
            publicationLanguage: b.Language,
            format: b.Format,
            originalPrice: b.Discount
                ? (b.Price + b.Discount).toString()
                : b.Price.toString(),
            offerPrice: b.Discount ? b.Price.toString() : "",
            offerPriceDate: b.DiscountStartDate
                ? b.DiscountStartDate.split("T")[0]
                : "",
            onSale: b.IsOnSale ? "yes" : "no",
            stock: b.Stock.toString(),
            description: b.Description,
            coverImage: b.CoverImagePath,
        });
        setEditingBookId(b.Id);
        setShowAddForm(true);
    };

    const filteredBooks = books.filter((b) =>
        b.Title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-indigo-800 text-white w-64 ${sidebarOpen ? "block" : "hidden"
                    } md:block`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
                    <div className="flex items-center">
                        <BookOpen size={24} className="mr-2" />
                        <span className="text-xl font-bold">Kindle Verse</span>
                    </div>
                    <button onClick={handleLogout}>
                        <LogOut size={20} className="hover:text-red-400" />
                    </button>
                </div>
                <nav className="mt-6">
                    {["books", "orders", "customers"].map((view) => (
                        <div
                            key={view}
                            className={`px-4 py-3 cursor-pointer hover:bg-indigo-700 ${view === "books" ? "bg-indigo-900" : ""
                                }`}
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

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <button
                        className="md:hidden"
                        onClick={() => setSidebarOpen((o) => !o)}
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Book Management
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                            <input
                                type="text"
                                placeholder="Search books..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                        </div>
                        <button
                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
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
                                        filteredBooks.map((b) => (
                                            <tr key={b.Id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-8 flex-shrink-0">
                                                            <img
                                                                className="h-10 w-8 rounded"
                                                                src={b.CoverImagePath}
                                                                alt={b.Title}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {b.Title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {b.Author}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {b.Publisher}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {b.Genre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {b.Format}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {b.ISBN}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${b.Price}
                                                    {b.Discount != null && (
                                                        <span className="ml-2 line-through text-gray-400">
                                                            ${(b.Price + b.Discount).toFixed(2)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {b.Stock}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEditBook(b)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(b.Id)}
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
                                                No books found.
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
                        {/* Header */}
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
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            className="p-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleBookSubmit();
                            }}
                        >
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter publisher"
                                    />
                                </div>

                                {/* Genre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Genre
                                    </label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={bookForm.genre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter genre"
                                    />
                                </div>

                                {/* Publication Language */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Publication Language
                                    </label>
                                    <input
                                        type="text"
                                        name="publicationLanguage"
                                        value={bookForm.publicationLanguage}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter language"
                                    />
                                </div>

                                {/* Format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Format
                                    </label>
                                    <input
                                        type="text"
                                        name="format"
                                        value={bookForm.format}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter format"
                                    />
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
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        value={bookForm.originalPrice}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                                value={bookForm.offerPrice}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                                value={bookForm.offerPriceDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2	border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <BookOpen size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="flex flex-col items-center px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-600 cursor-pointer hover:bg-indigo-50">
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
                                                        if (file.size > 2 * 1024 * 1024) return;
                                                        const reader = new FileReader();
                                                        reader.onloadend = () =>
                                                            setBookForm((f) => ({
                                                                ...f,
                                                                coverImage: reader.result,
                                                            }));
                                                        reader.readAsDataURL(file);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description & Actions */}
                            <div className="px-6 pb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={bookForm.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter book description"
                                />
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        {editingBookId ? "Update Book" : "Add Book"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
