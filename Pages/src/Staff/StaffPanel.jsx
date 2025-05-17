import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5126/api/orders/staff");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleStatusChange = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:5126/api/orders/${orderId}/status`,
        { status: "Completed" },
        { params: { userId: 0 } } // Replace with actual staff ID if needed
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Completed" } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5126/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Staff Panel - Orders
        </h2>

        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  OTP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total (Rs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => {
                const originalTotal = order.items.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0
                );
                const discountAmount = originalTotal - order.totalAmount;
                const discountPercentage =
                  originalTotal > 0
                    ? ((discountAmount / originalTotal) * 100).toFixed(1)
                    : 0;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.userName || `User #${order.userId}`}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {order.otp || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">
                          {order.totalAmount?.toFixed(2)}
                        </div>
                        {discountAmount > 0 && (
                          <div className="text-xs text-green-600">
                            {discountPercentage}% off from{" "}
                            {originalTotal.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <ul className="space-y-1 text-sm text-gray-800 list-disc pl-4">
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.productName} × {item.quantity} (Rs{" "}
                            {item.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(order.id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
                          title="Mark as Completed"
                          disabled={order.status === "Completed"}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                          title="Delete Order"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-4">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffOrders;
