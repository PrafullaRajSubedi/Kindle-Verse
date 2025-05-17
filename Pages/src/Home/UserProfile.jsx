import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, ShoppingBag, Tag, LogOut, CheckCircle } from "lucide-react";
import ProfileImage from "../assets/profile.jpg";

const API_URL = "http://localhost:5126/api/users";

const SidebarMenuItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
      isActive
        ? "bg-indigo-100 text-indigo-800"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon className="mr-3 h-5 w-5" />
    {label}
  </button>
);

const FormField = ({ label, id, value, onChange, type = "text", disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
        disabled ? "bg-gray-100 text-gray-400" : ""
      }`}
    />
  </div>
);

const Button = ({ children, onClick, variant = "primary", disabled }) => {
  const base =
    variant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-white border text-gray-700 hover:bg-gray-50";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${base}`}
    >
      {children}
    </button>
  );
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setEdit({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          password: "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token, userId]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/${userId}`,
        {
          firstName: edit.firstName,
          lastName: edit.lastName,
          password: edit.password || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update user profile:", err);
    }
  };

  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchUserOrders();
    }
  }, [activeTab]);

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5126/api/orders/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched orders:", res.data);
      setUserOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`http://localhost:5126/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserOrders(userOrders.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    if (activeTab === "discounts") {
      axios
        .get(`http://localhost:5126/api/Promo/MyPromoCodes?userId=${userId}`)
        .then((res) => setPromoCodes(res.data))
        .catch((err) => console.error("Failed to fetch promo codes:", err));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="w-full mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r bg-white p-4">
          <div className="flex flex-col items-center mb-6">
            <img
              src={ProfileImage}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover mb-2"
            />
            <h2 className="font-semibold text-lg text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="space-y-2">
            <SidebarMenuItem
              icon={User}
              label="Profile"
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SidebarMenuItem
              icon={ShoppingBag}
              label="Orders"
              isActive={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <SidebarMenuItem
              icon={Tag}
              label="Discounts"
              isActive={activeTab === "discounts"}
              onClick={() => setActiveTab("discounts")}
            />
            <SidebarMenuItem
              icon={LogOut}
              label="Logout"
              isActive={false}
              onClick={handleLogout}
            />
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 p-6 bg-white shadow rounded-lg">
          {activeTab === "profile" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
              {showSaved && (
                <div className="mb-4 flex items-center text-green-700 bg-green-100 p-3 rounded">
                  <CheckCircle className="h-5 w-5 mr-2" /> Profile updated
                  successfully!
                </div>
              )}
              <div className="space-y-4">
                <FormField
                  label="First Name"
                  id="firstName"
                  value={edit.firstName}
                  onChange={(e) =>
                    setEdit((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
                <FormField
                  label="Last Name"
                  id="lastName"
                  value={edit.lastName}
                  onChange={(e) =>
                    setEdit((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
                <FormField
                  label="Email"
                  id="email"
                  value={user.email}
                  disabled
                />
                <div className="flex gap-4 pt-2">
                  <Button onClick={handleUpdate}>Save Changes</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEdit({ ...edit, password: "" })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
              {userOrders.length === 0 ? (
                <p className="text-gray-500">You have no orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">
                          Order ID
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">
                          Total
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) => (
                        <tr key={order.id} className="border-t">
                          <td className="px-4 py-2">#{order.id}</td>
                          <td className="px-4 py-2">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">{order.status}</td>
                          <td className="px-4 py-2">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            {order.status === "Pending" ? (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-red-600 hover:underline"
                              >
                                Cancel Order
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "discounts" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Available Promo Codes
              </h2>
              {promoCodes.length === 0 ? (
                <p className="text-gray-500">No available promo codes.</p>
              ) : (
                <ul className="space-y-3">
                  {promoCodes.map((code) => (
                    <li
                      key={code.code}
                      className="border rounded p-3 bg-white shadow-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-mono font-semibold text-indigo-600">
                          {code.code}
                        </span>
                        <span className="text-sm text-green-600">
                          {(code.discountRate * 100).toFixed(0)}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Issued: {new Date(code.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
