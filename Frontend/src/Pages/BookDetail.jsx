import React from 'react';

const BookDetail = () => {
  return (
    <div className="bg-white text-gray-800 font-sans max-w-7xl mx-auto p-4 md:p-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Book Cover + Genres */}
        <div className="lg:w-1/4 flex flex-col items-center text-center">
          <img src="../../Images/Bookcover.jpg" alt="Book Cover" className="border-4 border-yellow-400 rounded-lg shadow-lg mb-4" />
          <div className="flex gap-4 my-3 justify-center">
            <button className="text-blue-600 hover:text-blue-800">🔖</button>
            <button className="text-blue-600 hover:text-blue-800">📘</button>
            <button className="text-blue-600 hover:text-blue-800">🐦</button>
            <button className="text-blue-600 hover:text-blue-800">🔗</button>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-1">Genres:</h3>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="text-blue-600 hover:underline">Business and Investing</a>: Business</li>
              <li><a href="#" className="text-blue-600 hover:underline">Self Improvement</a>: Self Help</li>
            </ul>
          </div>
        </div>

        {/* Book Info */}
        <div className="lg:w-2/4">
          <span className="bg-gray-200 px-3 py-1 text-xs font-medium rounded-full inline-block mb-2">Paper Back</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Napoleon Hill’s Greatest Speeches</h1>
          <p className="text-gray-600 mt-1 mb-4">by <span className="text-blue-600 font-medium">Napoleon Hill</span></p>

          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-500 text-xl">★</span>
            <span>N/A</span>
            <span className="text-sm text-gray-500">(0 Reviews)</span>
          </div>

          <p className="text-sm text-gray-700 mb-1">Sold by <a href="#" className="text-blue-600 hover:underline">Booksmandala Nepal</a></p>
          <p className="text-sm text-red-600 font-semibold mb-6">Only 6 items left in stock!</p>

          <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Includes the speech that inspired the bestseller THINK AND GROW RICH. Packed with timeless wisdom,
            this book features some of Hill’s most powerful speeches that motivate, inspire, and teach practical
            strategies for personal and professional growth.
          </p>
        </div>

        {/* Purchase Box */}
        <div className="lg:w-1/4 bg-gray-50 rounded-lg p-4 shadow-md">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600">Get Estimated Arrival Time</h4>
            <p className="text-sm mt-1">📍 Kathmandu, Nepal</p>
            <p className="text-sm text-gray-500">🚚 Delivery Within: <strong>1 to 2 days</strong></p>
          </div>

          <p className="text-2xl font-semibold text-gray-800 mb-2">Rs. 720</p>

          <div className="flex items-center gap-3 mb-4">
            <button className="qty-decrement px-3 py-1 bg-gray-200 rounded text-xl hover:bg-gray-300">−</button>
            <span className="qty-value text-lg font-medium">1</span>
            <button className="qty-increment px-3 py-1 bg-gray-200 rounded text-xl hover:bg-gray-300">+</button>
          </div>

          <button className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">ADD TO CART</button>
        </div>
      </div>

      {/* Other Info */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Other info</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div><div className="text-gray-500 text-sm">Page Count</div><div className="text-lg font-medium">284 Pages</div></div>
          <div><div className="text-gray-500 text-sm">Weight</div><div className="text-lg font-medium">270g</div></div>
          <div><div className="text-gray-500 text-sm">ISBN</div><div className="text-lg font-medium">9788184959918</div></div>
          <div><div className="text-gray-500 text-sm">Language</div><div className="text-lg font-medium">English</div></div>
        </div>
      </div>

      {/* Ratings */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Ratings & Reviews</h3>
        <div className="flex flex-col md:flex-row items-center gap-6 bg-blue-50 p-6 rounded">
          <div className="text-4xl font-bold text-blue-800">N/A</div>
          <div className="flex-1">
            <p className="text-gray-700 mb-2">How would you rate this book?</p>
            <div className="flex gap-1 text-yellow-400 text-2xl">★ ★ ★ ★ ★</div>
          </div>
          <img src="../javascript.svg" alt="Reviews" className="h-24" />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
