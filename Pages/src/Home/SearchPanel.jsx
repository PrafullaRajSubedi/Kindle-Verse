import React, { useState, useEffect } from "react";
import { X, Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import axios from "axios";

const SearchPanel = ({ onSearch, onClose }) => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Dropdown options
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [formats, setFormats] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // For quick searches
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularGenres, setPopularGenres] = useState([]);

  useEffect(() => {
    // Load filter options from the backend
    fetchFilterOptions();

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }

    // Popular genres could be hardcoded or loaded from backend
    setPopularGenres([
      "Fiction and Literature",
      "Science Fiction",
      "Mystery & Thriller",
      "Romance",
      "Business and Investing",
    ]);
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const baseUrl = "http://localhost:5126/api/BookFilter";

      const [authorsRes, genresRes, languagesRes, formatsRes, publishersRes] =
        await Promise.all([
          axios.get(`${baseUrl}/authors`),
          axios.get(`${baseUrl}/genres`),
          axios.get(`${baseUrl}/languages`),
          axios.get(`${baseUrl}/formats`),
          axios.get(`${baseUrl}/publishers`),
        ]);

      setAuthors(authorsRes.data);
      setGenres(genresRes.data);
      setLanguages(languagesRes.data);
      setFormats(formatsRes.data);
      setPublishers(publishersRes.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      // Handle error appropriately
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Save this search to recent searches
    if (searchQuery.trim()) {
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }

    // Prepare search parameters
    const searchParams = {
      search: searchQuery,
    };

    // Only add filter parameters if they have values
    if (selectedAuthor) searchParams.author = selectedAuthor;
    if (selectedGenre) searchParams.genre = selectedGenre;
    if (selectedLanguage) searchParams.language = selectedLanguage;
    if (selectedFormat) searchParams.format = selectedFormat;
    if (selectedPublisher) searchParams.publisher = selectedPublisher;
    if (inStockOnly) searchParams.inStock = true;
    if (minPrice) searchParams.minPrice = minPrice;
    if (maxPrice) searchParams.maxPrice = maxPrice;
    if (sortBy) searchParams.sortBy = sortBy;
    if (sortOrder) searchParams.sortOrder = sortOrder;

    onSearch(searchParams);
  };

  const handleQuickSearch = (query, type = null) => {
    // Handle a quick search (recent searches or genre clicks)
    const searchParams = { search: query };

    if (type === "genre") {
      searchParams.genre = query;
    }

    onSearch(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor("");
    setSelectedGenre("");
    setSelectedLanguage("");
    setSelectedFormat("");
    setSelectedPublisher("");
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("title");
    setSortOrder("asc");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Search Books</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSearch}>
        <div className="flex mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books, authors, ISBN..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3"
            />
          </div>
          <button
            type="submit"
            className="ml-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-3"
          >
            Search
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-blue-700 hover:text-blue-900 flex items-center text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            {showAdvancedFilters
              ? "Hide Advanced Filters"
              : "Show Advanced Filters"}
          </button>

          {showAdvancedFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {showAdvancedFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filter Dropdowns */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Author
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Any Author</option>
                {authors.map((author, index) => (
                  <option key={index} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Any Genre</option>
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Any Language</option>
                {languages.map((language, index) => (
                  <option key={index} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Any Format</option>
                {formats.map((format, index) => (
                  <option key={index} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Publisher
              </label>
              <select
                value={selectedPublisher}
                onChange={(e) => setSelectedPublisher(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Any Publisher</option>
                {publishers.map((publisher, index) => (
                  <option key={index} value={publisher}>
                    {publisher}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Availability
              </label>
              <div className="flex items-center">
                <input
                  id="inStock"
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="inStock"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  In Stock Only
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span className="self-center">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                  <option value="publicationdate">Publication Date</option>
                  <option value="popularity">Popularity</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Quick search section */}
      <div className="mt-6">
        {recentSearches.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Popular Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularGenres.map((genre, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(genre, "genre")}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full transition"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
