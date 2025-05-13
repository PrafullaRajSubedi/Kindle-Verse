import { useState } from "react";
import { ArrowLeft, Bookmark, Heart, Share2 } from "lucide-react";

export default function BookDetail({ book, onBack }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Book Details</h1>
      </div>

      <div className="flex mb-6">
        <img
          src={book.image.replace("80/120", "240/360")}
          alt={book.title}
          className="w-32 h-48 object-cover rounded-md mr-4 shadow-md"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {book.title}
          </h2>
          <p className="text-lg text-gray-600 mb-2">{book.author}</p>
          <div className="flex items-center mb-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
              {book.category}
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <div>Published: {book.publishYear}</div>
            <div>Pages: {book.pages}</div>
          </div>
          <div className="flex space-x-4">
            <button
              className={`p-2 rounded-full ${
                isFavorite
                  ? "bg-red-100 text-red-500"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={toggleFavorite}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 rounded-full bg-indigo-100 text-indigo-500">
              <Bookmark size={20} fill="currentColor" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-500">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {book.description}
        </p>
      </div>

      <div className="mt-6">
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700">
          Add to Reading List
        </button>
      </div>
    </div>
  );
}