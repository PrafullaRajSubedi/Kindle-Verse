import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Star,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import harryp from "../assets/harryp.jpg";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fetchedBooks, setFetchedBooks] = useState([]);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4); // Show 4 books per page (2 rows of 4 books)

  // Calculate heroBooks dynamically based on discounted books
  const heroBooks = useMemo(() => {
    // Filter books that are on sale and have discount information
    const booksOnSale = fetchedBooks.filter(
      (book) =>
        book.isOnSale &&
        book.originalPrice &&
        book.salePrice &&
        book.originalPrice > book.salePrice
    );

    // Calculate discount percentage for each book
    const booksWithDiscount = booksOnSale.map((book) => {
      const discountAmount = book.originalPrice - book.salePrice;
      const discountPercentage = Math.round(
        (discountAmount / book.originalPrice) * 100
      );

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        discount: `${discountPercentage}% OFF`,
        discountValue: discountPercentage, // For sorting
        coverImagePath: book.coverImagePath,
      };
    });

    // Sort by discount percentage (highest first) and take top 3
    return booksWithDiscount
      .sort((a, b) => b.discountValue - a.discountValue)
      .slice(0, 3);
  }, [fetchedBooks]);

  const genres = [
    {
      id: 1,
      name: "Arts & Photography",
      icon: "🎨",
      iconColor: "rgb(218, 68, 240)",
      iconBg: "rgb(250, 242, 255)",
    },
    {
      id: 2,
      name: "Boxed Sets",
      icon: "📦",
      iconColor: "rgb(240, 147, 43)",
      iconBg: "rgb(255, 246, 232)",
    },
    {
      id: 3,
      name: "Business and Investing",
      icon: "💼",
      iconColor: "rgb(158, 93, 44)",
      iconBg: "rgb(255, 246, 232)",
    },
    {
      id: 4,
      name: "Fiction and Literature",
      icon: "🎭",
      iconColor: "rgb(255, 127, 49)",
      iconBg: "rgb(255, 246, 239)",
    },
    {
      id: 5,
      name: "Foreign Languages",
      icon: "🗣️",
      iconColor: "rgb(49, 107, 255)",
      iconBg: "rgb(239, 243, 255)",
    },
    {
      id: 6,
      name: "History, Biography, and Politics",
      icon: "💬",
      iconColor: "rgb(28, 178, 226)",
      iconBg: "rgb(236, 249, 255)",
    },
    {
      id: 7,
      name: "Kids and Teens",
      icon: "😊",
      iconColor: "rgb(240, 55, 165)",
      iconBg: "rgb(255, 239, 248)",
    },
    {
      id: 8,
      name: "Learning and Reference",
      icon: "🍃",
      iconColor: "rgb(110, 110, 110)",
      iconBg: "rgb(245, 245, 245)",
    },
    {
      id: 9,
      name: "Lifestyle and Wellness",
      icon: "🧘",
      iconColor: "rgb(37, 208, 97)",
      iconBg: "rgb(237, 255, 242)",
    },
    {
      id: 10,
      name: "Manga and Graphic Novels",
      icon: "🌊",
      iconColor: "rgb(28, 178, 226)",
      iconBg: "rgb(236, 249, 255)",
    },
  ];

  const nextSlide = () => {
    if (heroBooks.length <= 1) return; // Don't slide if there's only 0 or 1 book
    setCurrentSlide((prev) => (prev === heroBooks.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (heroBooks.length <= 1) return; // Don't slide if there's only 0 or 1 book
    setCurrentSlide((prev) => (prev === 0 ? heroBooks.length - 1 : prev - 1));
  };

  // Reset current slide when heroBooks change
  useEffect(() => {
    setCurrentSlide(0);
  }, [heroBooks.length]);

  const scrollLeft = () =>
    document
      .getElementById("genres-container")
      ?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    document
      .getElementById("genres-container")
      ?.scrollBy({ left: 300, behavior: "smooth" });

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ));

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5126/api/user-books"
        );
        setFetchedBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleBookmark = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to bookmark.");

      await axios.post(
        `http://localhost:5126/api/bookmarks/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking:", error);
      alert(
        error.response?.data || "Failed to bookmark. Maybe already bookmarked?"
      );
    }
  };

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = fetchedBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Calculate total pages
  const totalPages = Math.ceil(fetchedBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = async (bookId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login to add to cart.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5126/api/cart/add-to-cart?userId=${userId}&bookId=${bookId}&quantity=1`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert(error.response?.data || "Failed to add to cart.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-neutral-100 to-pink-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          {/* Show arrows only if there are multiple books */}
          {heroBooks.length > 1 && (
            <>
              {/* Left arrow */}
              <div className="absolute inset-y-0 left-2 flex items-center z-10">
                <button
                  onClick={prevSlide}
                  className="bg-white/70 hover:bg-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>

              {/* Right arrow */}
              <div className="absolute inset-y-0 right-2 flex items-center z-10">
                <button
                  onClick={nextSlide}
                  className="bg-white/70 hover:bg-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </>
          )}

          <div className="flex items-center">
            {heroBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left text content */}
                <div className="flex flex-col justify-center order-2 md:order-1">
                  {/* Discount badge for mobile */}
                  <div className="absolute top-8 right-8 bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold md:hidden">
                    {heroBooks[currentSlide]?.discount}
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                    {heroBooks[currentSlide]?.title}
                  </h1>
                  <p className="text-lg sm:text-xl mb-2 text-neutral-600">
                    By {heroBooks[currentSlide]?.author}
                  </p>
                  <p className="text-xl sm:text-2xl font-medium mb-8">
                    Best Offer{" "}
                    <span className="text-blue-700">
                      {heroBooks[currentSlide]?.discount}
                    </span>
                    . Grab it now!
                  </p>

                  <div className="flex space-x-4">
                    <button className="bg-blue-700 hover:bg-blue-900 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                      Shop Now
                    </button>
                    <button className="bg-white hover:bg-neutral-100 text-blue-700 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border border-blue-700">
                      View Details
                    </button>
                  </div>

                  {/* Slide dots - only show if there are multiple books */}
                  {heroBooks.length > 1 && (
                    <div className="flex mt-8 justify-center md:justify-start space-x-2">
                      {heroBooks.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full ${
                            currentSlide === index
                              ? "bg-blue-700"
                              : "bg-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Book image with overlaid badge */}
                <div className="relative order-1 md:order-2 flex justify-center items-center">
                  <div className="relative w-64 h-80 md:w-72 md:h-96 shadow-2xl rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                    {/* Badge correctly placed */}
                    <div className="absolute top-2 left-2 bg-blue-700 text-white px-4 py-1 text-sm font-semibold rounded-full shadow-lg transform -rotate-12 z-10">
                      {heroBooks[currentSlide]?.discount}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <img
                      src={heroBooks[currentSlide]?.coverImagePath || harryp}
                      alt={heroBooks[currentSlide]?.title}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center w-full py-12">
                <div className="bg-neutral-100 rounded-xl p-8 max-w-2xl mx-auto shadow-md">
                  <AlertCircle className="h-16 w-16 text-blue-700 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4">No Books On Sale</h2>
                  <p className="text-lg text-neutral-600 mb-6">
                    There are currently no book offers available. Check back
                    later for exciting discounts!
                  </p>
                  <button className="bg-blue-700 hover:bg-blue-900 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                    Browse All Books
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">Genres</h2>
              <p className="text-neutral-600">
                Browse Our Extensive Collection of Books Across Different
                Genres.
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={scrollLeft}
                className="bg-white hover:bg-neutral-100 p-2 rounded-full border border-neutral-200 shadow-sm transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollRight}
                className="bg-white hover:bg-neutral-100 p-2 rounded-full border border-neutral-200 shadow-sm transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            id="genres-container"
            className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 pb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow"
                  style={{ backgroundColor: genre.iconBg }}
                >
                  <div className="text-4xl" style={{ color: genre.iconColor }}>
                    {genre.icon}
                  </div>
                </div>
                <span className="text-center text-sm font-medium whitespace-normal max-w-[120px]">
                  {genre.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Section*/}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Books</h2>
            <a
              href="#"
              className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {currentBooks.map((book) => (
              <div key={book.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={book.coverImagePath}
                      alt={book.title}
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                    />
                    {book.isOnSale && (
                      <div className="absolute top-0 left-0 bg-red-700 text-white px-4 py-2 text-s font-bold">
                        On Sale
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAddToCart(book.id)}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-blue-700 hover:text-white transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>

                      <button
                        className="bg-white p-2 rounded-full shadow-md hover:bg-blue-700 hover:text-white transition-colors"
                        onClick={() => handleBookmark(book.id)}
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(book.rating)}
                    </div>

                    <h3 className="font-bold text-lg mb-1 group-hover:text-blue-900 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-2">
                      {book.author}
                    </p>
                    <p className="font-medium text-lg">
                      NPR {book.salePrice?.toFixed(2)}
                      {book.isOnSale && (
                        <span className="line-through text-sm text-gray-400 ml-2">
                          NPR {book.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                    currentPage === 1
                      ? "border-neutral-200 text-neutral-400 cursor-not-allowed"
                      : "border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                  } transition-colors`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Generate page number buttons */}
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentPage === number + 1
                        ? "bg-blue-700 text-white"
                        : "border border-neutral-200 hover:border-blue-700 hover:text-blue-700"
                    } transition-colors`}
                  >
                    {number + 1}
                  </button>
                ))}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                    currentPage === totalPages
                      ? "border-neutral-200 text-neutral-400 cursor-not-allowed"
                      : "border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                  } transition-colors`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
