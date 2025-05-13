import { useState, useEffect } from "react";
import axios from "axios";
import {
  Bell, ChevronRight, Trash2, Search, MessageCircle, Calendar, X, Plus
} from "lucide-react";

const API_BASE = "http://localhost:5126/api/announcement";

export default function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    expiresAt: "",
  });

  // 👉 Fetch active announcements on load
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/get-active`);
        const mapped = data.map((a) => ({
          id: a.id,
          title: a.title,
          message: a.message,
          createdAt: a.createdAt,
          expiresAt: a.endDate,
        }));
        setAnnouncements(mapped);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAnnouncement = async () => {
    try {
      const now = new Date().toISOString();
      const response = await axios.post(`${API_BASE}/create`, {
        title: formData.title,
        message: formData.message,
        startDate: now,
        endDate: new Date(formData.expiresAt).toISOString(),
      });

      const newAnnouncement = {
        id: response.data.id,
        title: formData.title,
        message: formData.message,
        createdAt: now,
        expiresAt: formData.expiresAt,
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      setFormData({ title: "", message: "", expiresAt: "" });
      setShowNewForm(false);
    } catch (err) {
      console.error("Failed to create announcement:", err);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      setAnnouncements((a) => a.filter((x) => x.id !== id));
      if (selectedAnnouncement?.id === id) setSelectedAnnouncement(null);
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-500" size={20} />
          <h2 className="text-xl font-bold dark:text-white">Announcements</h2>
        </div>
        <button
          className="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors"
          onClick={() => setShowNewForm(true)}
        >
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div
          className={`flex-1 overflow-y-auto border-r dark:border-gray-700 ${
            selectedAnnouncement ? "hidden md:block md:w-1/2" : "w-full"
          }`}
        >
          {filteredAnnouncements.length > 0 ? (
            <div className="space-y-2 p-3">
              {filteredAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  onClick={() => setSelectedAnnouncement(a)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {a.title}
                    </h4>
                    <button
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnnouncement(a.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {a.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar
                      size={16}
                      className="text-gray-500 dark:text-gray-400 mt-0.5"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(a.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageCircle
                size={36}
                className="text-gray-400 dark:text-gray-600 mb-2"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No announcements found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {searchQuery
                  ? "Try a different search"
                  : "Create your first announcement by clicking “New Announcement”"}
              </p>
            </div>
          )}
        </div>

        {/* Detail View */}
        {selectedAnnouncement && (
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 md:w-1/2">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <button
                className="md:hidden flex items-center text-sm text-gray-500 dark:text-gray-400"
                onClick={() => setSelectedAnnouncement(null)}
              >
                <ChevronRight size={16} className="transform rotate-180 mr-1" />
                Back
              </button>
              <h3 className="text-lg font-semibold dark:text-white">
                Announcement Details
              </h3>
              <button
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                onClick={() =>
                  handleDeleteAnnouncement(selectedAnnouncement.id)
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedAnnouncement.title}
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-line">
                    {selectedAnnouncement.message}
                  </p>
                </div>
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar
                        size={16}
                        className="text-gray-500 dark:text-gray-400 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(selectedAnnouncement.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar
                        size={16}
                        className="text-gray-500 dark:text-gray-400 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Expires
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(selectedAnnouncement.expiresAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Announcement Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">
                New Announcement
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowNewForm(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="p-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowNewForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleCreateAnnouncement}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}