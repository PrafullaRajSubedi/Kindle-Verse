import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import harryp from "../assets/harryp.jpg";
import Book1 from "../assets/bestselling.jpeg";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [fetchedBooks, setFetchedBooks] = useState([]);

  const heroBooks = [
    {
      id: 1,
      title: "Harry Potter Series",
      author: "Lauren Asher",
      discount: "30% OFF",
    },
    {
      id: 2,
      title: "Fourth Wing",
      author: "Rebecca Yarros",
      discount: "25% OFF",
    },
    {
      id: 3,
      title: "It Ends With Us",
      author: "Colleen Hoover",
      discount: "35% OFF",
    },
  ];

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

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === heroBooks.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? heroBooks.length - 1 : prev - 1));

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
          "http://localhost:PORT/api/user-books"
        );
        setFetchedBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-neutral-100 to-pink-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
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

          <div className="flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left text content */}
              <div className="flex flex-col justify-center order-2 md:order-1">
                {/* Discount badge for mobile */}
                <div className="absolute top-8 right-8 bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold md:hidden">
                  {heroBooks[currentSlide].discount}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  {heroBooks[currentSlide].title}
                </h1>
                <p className="text-lg sm:text-xl mb-2 text-neutral-600">
                  By {heroBooks[currentSlide].author}
                </p>
                <p className="text-xl sm:text-2xl font-medium mb-8">
                  Best Offer{" "}
                  <span className="text-blue-700">
                    {heroBooks[currentSlide].discount}
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

                {/* Slide dots */}
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
              </div>

              {/* Book image with overlaid badge */}
              <div className="relative order-1 md:order-2 flex justify-center items-center">
                <div className="relative w-64 h-80 md:w-72 md:h-96 shadow-2xl rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                  {/* Badge correctly placed */}
                  <div className="absolute top-2 left-2 bg-blue-700 text-white px-4 py-1 text-sm font-semibold rounded-full shadow-lg transform -rotate-12 z-10">
                    {heroBooks[currentSlide].discount}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <img
                    src={harryp}
                    alt={heroBooks[currentSlide].title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
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
            {fetchedBooks.map((book) => (
              <div key={book.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={Book1}
                      alt={book.title}
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-700 hover:text-white transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-700 hover:text-white transition-colors">
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
                    <p className="font-medium text-lg">{book.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
