import { useState, useEffect } from "react";
import {
  ShoppingCart,
  BookOpen,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Info,
  AlertCircle,
  X,
  Plus,
  Minus,
} from "lucide-react";
import axios from "axios";
import Silent from "../assets/SILENT.jpg";

// Cart Item Component
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex-shrink-0 w-full sm:w-24 h-32 sm:h-36 mb-3 sm:mb-0">
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-full object-cover rounded-md shadow-sm"
          onError={(e) => {
            e.target.src = Silent;
          }}
        />
      </div>
      <div className="flex-grow sm:pl-6 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">by {item.author}</p>
            <div className="mt-1 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                {item.format}
              </span>
              {item.isExclusive && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Exclusive Edition
                </span>
              )}
              {item.onSale && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  On Sale
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap justify-between items-end pt-3">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() =>
                onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min="1"
              max={item.stockCount}
              value={item.quantity}
              onChange={(e) =>
                onUpdateQuantity(
                  item.id,
                  Math.min(
                    item.stockCount,
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                )
              }
              className="w-10 text-center border-x border-gray-300 py-1 text-sm"
              aria-label="Quantity"
            />
            <button
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() =>
                onUpdateQuantity(
                  item.id,
                  Math.min(item.stockCount, item.quantity + 1)
                )
              }
              disabled={item.quantity >= item.stockCount}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="text-right mt-3 sm:mt-0">
            <p className="text-lg font-medium text-gray-900">
              ${item.price.toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500">
                ${(item.price * item.quantity).toFixed(2)} total
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component with Discount Code feature
const OrderSummary = ({
  cartItems,
  subtotal,
  discount,
  total,
  eligibleForDiscount,
  volumeDiscountAmount,
  onPlaceOrder,
  onApplyDiscountCode,
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [codeMessage, setCodeMessage] = useState(null);

  // Calculate the actual total number of items (accounting for quantities)
  const totalItemCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleApplyCode = () => {
    if (!discountCode.trim()) {
      setCodeMessage({ type: "error", text: "Please enter a discount code" });
      return;
    }

    setIsApplying(true);

    // Simulate API call to validate discount code
    setTimeout(() => {
      setIsApplying(false);

      // Apply the discount code (this would normally check against valid codes in a database)
      const result = onApplyDiscountCode(discountCode);

      if (result.success) {
        setCodeMessage({ type: "success", text: result.message });
      } else {
        setCodeMessage({ type: "error", text: result.message });
      }
    }, 800);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal ({totalItemCount} items)
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {volumeDiscountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Volume Discount (5%)</span>
            <span>-${volumeDiscountAmount.toFixed(2)}</span>
          </div>
        )}

        {discount > 0 && discount !== volumeDiscountAmount && (
          <div className="flex justify-between text-green-600">
            <span>Code Discount</span>
            <span>-${(discount - volumeDiscountAmount).toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Discount Code Input */}
      <div className="mb-6">
        <label
          htmlFor="discount-code"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Discount Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="discount-code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={handleApplyCode}
            disabled={isApplying || !discountCode.trim()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isApplying ? "Applying..." : "Apply"}
          </button>
        </div>
        {codeMessage && (
          <p
            className={`mt-1 text-sm ${
              codeMessage.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {codeMessage.text}
          </p>
        )}
      </div>

      {eligibleForDiscount && volumeDiscountAmount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6 flex items-start">
          <Info
            size={16}
            className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-green-700">
            You've qualified for a 5% volume discount by ordering 5 or more
            books!
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-start mb-4">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="h-4 w-4 text-indigo-600 rounded mt-1 focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I understand that this order is for in-store pickup only and I will
            need to present my membership ID and claim code to complete the
            purchase.
          </label>
        </div>

        <button
          onClick={onPlaceOrder}
          disabled={!acceptTerms || cartItems.length === 0}
          className="w-full py-3 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p className="flex items-start">
          <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          Orders can be cancelled up to 24 hours before the scheduled pickup.
        </p>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  return (
    <div className="text-center py-12">
      <ShoppingCart size={64} className="mx-auto text-gray-400" />
      <h2 className="mt-4 text-xl font-medium text-gray-900">
        Your cart is empty
      </h2>
      <p className="mt-2 text-gray-600">
        Browse our collection to find your next favorite read.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Continue Shopping
      </button>
    </div>
  );
};

// Order Confirmation Modal Component
const OrderConfirmationModal = ({ show, orderDetails, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 p-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="text-center sm:text-left">
              <h3
                className="text-lg font-medium leading-6 text-gray-900"
                id="modal-title"
              >
                Order Confirmed!
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Your order has been successfully placed. A confirmation email
                  has been sent to your registered email address.
                </p>

                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Order ID:</span>
                    <span className="text-gray-900">
                      {orderDetails.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      Claim Code:
                    </span>
                    <span className="bg-indigo-100 px-2 py-1 rounded text-indigo-800 font-mono">
                      {orderDetails.claimCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Total Amount:
                    </span>
                    <span className="text-gray-900">
                      ${orderDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Next Steps:
                  </h4>
                  <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
                    <li>Visit our store during opening hours</li>
                    <li>
                      Present your membership ID and claim code at the counter
                    </li>
                    <li>Our staff will process your order</li>
                    <li>Make payment and collect your books</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Context Notification
const CartNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
      ? "bg-red-50 border-red-200"
      : "bg-blue-50 border-blue-200";

  const textColor =
    type === "success"
      ? "text-green-800"
      : type === "error"
      ? "text-red-800"
      : "text-blue-800";

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-md border ${bgColor} max-w-md animate-fade-in`}
    >
      <div className="flex justify-between items-start">
        <div className={`${textColor} text-sm font-medium`}>{message}</div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Valid discount codes
const VALID_DISCOUNT_CODES = {
  WELCOME10: { rate: 0.1, message: "10% discount applied!" },
  SUMMERREADS: { rate: 0.15, message: "15% summer discount applied!" },
  BOOKWORM25: {
    rate: 0.25,
    message: "25% discount applied for our loyal readers!",
  },
  FIRSTORDER: { rate: 0.2, message: "20% first order discount applied!" },
};

// Main Cart Page Component
export default function BookstoreCartPage() {
  // Cart items state
  const [cartItems, setCartItems] = useState([]);

  // State for order confirmation modal
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  // State for notifications
  const [notification, setNotification] = useState(null);

  // State for applied discount code
  const [appliedDiscountCode, setAppliedDiscountCode] = useState(null);

  // Calculate the actual total number of items (accounting for quantities)
  const totalItemCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const eligibleForVolumeDiscount = totalItemCount >= 5;
  const volumeDiscountRate = eligibleForVolumeDiscount ? 0.05 : 0;
  const volumeDiscountAmount = subtotal * volumeDiscountRate;

  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const codeDiscountRate = promoDiscountRate;
  const codeDiscountAmount = subtotal * codeDiscountRate;

  // Total discount and final total
  const totalDiscount = volumeDiscountAmount + codeDiscountAmount;
  const total = subtotal - totalDiscount;

  const handleRemoveItem = async (bookId) => {
    const userId = localStorage.getItem("userId");

    try {
      await axios.delete(
        `http://localhost:5126/api/cart/${userId}/items/${bookId}`
      );

      // Now update local state
      setCartItems(cartItems.filter((item) => item.id !== bookId));
      showNotification("Item removed from cart", "info");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  // Handler to update item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handler to apply discount code
  const handleApplyDiscountCode = async (code) => {
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.get(`http://localhost:5126/api/Promo/Apply`, {
        params: {
          userId,
          totalItemCount,
          promoCode: code,
        },
      });

      if (res.data.success) {
        setAppliedDiscountCode(code);
        setPromoDiscountRate(res.data.promoDiscount);
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      console.error("Promo apply failed:", err);
      return { success: false, message: "Failed to validate code" };
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      alert("Please log in to place an order.");
      return;
    }

    const payload = {
      orderItems: cartItems.map((item) => ({
        productName: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      finalTotal: total,
      promoCode: appliedDiscountCode,
    };

    try {
      const response = await axios.post(
        `http://localhost:5126/api/orders?userId=${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const created = response.data;

      setOrderDetails({
        orderId: created.orderNumber,
        claimCode: created.orderNumber,
        total: total,
        date: created.orderDate,
        items: created.orderItems,
        userName: created.userName,
      });

      setCartItems([]);
      setAppliedDiscountCode(null);
      setShowOrderConfirmation(true);
    } catch (err) {
      console.error("Order placement failed:", err);
      if (appliedDiscountCode) {
        await axios.post(
          "http://localhost:5126/api/Promo/MarkUsed",
          JSON.stringify(appliedDiscountCode),
          { headers: { "Content-Type": "application/json" } }
        );
      }
      alert(err.response?.data?.message || "Error placing orer.");
    }
  };

  // Function to show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  // Function to clear notification
  const clearNotification = () => {
    setNotification(null);
  };

  // Handler for closing the order confirmation and clearing the cart
  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setCartItems([]);
    setAppliedDiscountCode(null);
  };

  // Handle back to profile button
  const handleBackToProfile = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5126/api/cart/${userId}`
        );
        const items = response.data.cartItems.map((item) => ({
          id: item.bookId,
          title: item.title,
          author: item.author,
          // you can pull format, exclusive-flag, etc. from your DTO if you add them,
          // or keep your defaults:
          format: "Paperback",
          isExclusive: false,

          // use the flat price fields
          price: item.price,
          originalPrice: item.originalPrice,

          quantity: item.quantity,
          stockCount: 10, // or wire up a real field if you add it
          onSale: item.isOnSale,

          // CoverImagePath → coverImagePath
          coverImage: item.coverImagePath || "/api/placeholder/200/200",
        }));

        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleBackToProfile}
            className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            <ChevronLeft size={16} className="mr-1" />
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-grow">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Cart Items ({totalItemCount})
                  </h2>
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={handleRemoveItem}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                discount={totalDiscount}
                total={total}
                eligibleForDiscount={eligibleForVolumeDiscount}
                volumeDiscountAmount={volumeDiscountAmount}
                onPlaceOrder={handlePlaceOrder}
                onApplyDiscountCode={handleApplyDiscountCode}
              />
            </div>
          </div>
        )}
      </main>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        show={showOrderConfirmation}
        orderDetails={orderDetails}
        onClose={handleCloseOrderConfirmation}
      />

      {/* Notification */}
      {notification && (
        <CartNotification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}
