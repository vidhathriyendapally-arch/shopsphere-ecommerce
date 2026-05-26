import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

/* FIXED IMAGES */

import iphone from "../images/phone.jpg";
import samsung from "../images/samsung.jpg";
import laptop from "../images/laptop.jpg";
import headphones from "../images/headphones.jpg";
import tshirt from "../images/tshirt.jpg";
import jeans from "../images/jeans.jpg";
import jacket from "../images/jacket.jpg";
import kurti from "../images/kurti.jpg";
import dsa from "../images/dsa.jpg";
import java from "../images/java.jpg";
import python from "../images/python.jpg";
import ai from "../images/ai.jpg";
import mixer from "../images/mixer.jpg";
import ac from "../images/ac.jpg";
import fridge from "../images/fridge.jpg";

function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const navigate = useNavigate();

  const customerId =
    localStorage.getItem("customer_id");

  const token =
    localStorage.getItem("token");

  /* ================= IMAGE MAP ================= */

  const imageMap = {

    "iPhone 14": iphone,
    "Samsung S23": samsung,
    "Dell Laptop": laptop,
    "Sony Headphones": headphones,
    "T-Shirt": tshirt,
    "Jeans": jeans,
    "Jacket": jacket,
    "Kurti": kurti,
    "DSA Book": dsa,
    "Java Book": java,
    "Python Book": python,
    "AI Book": ai,
    "Mixer": mixer,
    "AC": ac,
    "Fridge": fridge

  };

  /* ================= LOAD CART ================= */

  const loadCart = async () => {

    try {

      const res = await fetch(

        `http://your-render-backend-url.onrender.com/cart/${customerId}`,

        {
          headers: {
            authorization: token
          }
        }

      );

      const data = await res.json();

      setCartItems(data);

    } catch (err) {

      console.log(err);

    }
  };

  /* ================= LOAD TOTAL ================= */

  const loadTotal = async () => {

    try {

      const res = await fetch(

        `http://your-render-backend-url.onrender.com/cart/total/${customerId}`,

        {
          headers: {
            authorization: token
          }
        }

      );

      const data = await res.json();

      setSubtotal(data.total);

    } catch (err) {

      console.log(err);

    }
  };

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = async (id, quantity) => {

    if (quantity < 1) {
      return;
    }

    try {

      const res = await fetch(

        "http://your-render-backend-url.onrender.com/cart/update",

        {

          method: "PUT",

          headers: {

            "Content-Type": "application/json",
            authorization: token

          },

          body: JSON.stringify({

            id,
            quantity

          })

        }

      );

      const data = await res.json();

      console.log(data);

      loadCart();
      loadTotal();

    } catch (err) {

      console.log(err);

    }
  };

  /* ================= PLACE ORDER ================= */

  const _placeOrder = async () => {

    if (cartItems.length === 0) {

      alert("Cart is empty ❌");

      return;
    }

    try {

      const res = await fetch(

        "http://your-render-backend-url.onrender.com/order",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",
            authorization: token

          },

          body: JSON.stringify({

            customer_id: customerId

          })

        }

      );

      const data = await res.json();

      alert(

`Order placed successfully ✅
Order ID: ${data.order_id}
Total: ₹${finalTotal}`

      );

      loadCart();
      loadTotal();

    } catch (err) {

      console.log(err);

      alert("Order failed ❌");

    }
  };

  /* ================= REMOVE ITEM ================= */

  const removeItem = async (cartId) => {

    try {

      const res = await fetch(

        `http://your-render-backend-url.onrender.com/cart/remove/${cartId}`,

        {

          method: "DELETE",

          headers: {

            authorization: token

          }

        }

      );

      const data = await res.json();

      alert(data.message);

      loadCart();
      loadTotal();

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {
  loadCart();
  loadTotal();
}, [loadCart, loadTotal]);

  /* ================= BILL ================= */

  const deliveryCharge =
    subtotal > 0 ? 99 : 0;

  const platformFee =
    subtotal > 0 ? 29 : 0;

  const finalTotal =

    Number(subtotal) +
    Number(deliveryCharge) +
    Number(platformFee);

  return (

    <div className="cart-page">

      <h1 className="cart-title">
        🛒 My Shopping Cart
      </h1>

      <div className="cart-layout">

        {/* ================= LEFT SIDE ================= */}

        <div className="cart-items-section">

          {cartItems.length === 0 ? (

            <div className="empty-cart">

              <h2>Your cart is empty ❌</h2>

            </div>

          ) : (

            cartItems.map((item) => (

              <div
                className="cart-card"
                key={item.id}
              >

                {/* ================= IMAGE ================= */}

                <img
                  src={
                    item.product_id <= 15
                      ? imageMap[item.product_name]
                      : `http://your-render-backend-url.onrender.com/uploads/${item.image}`
                  }

                  alt={item.product_name}

                  className="cart-product-image"
                />

                {/* ================= DETAILS ================= */}

                <div className="cart-details">

                  <h2>
                    {item.product_name}
                  </h2>

                  <p>
                    Price: ₹{item.price}
                  </p>

                  {/* ================= QUANTITY ================= */}

                  <div className="quantity-box">

                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span className="qty-number">
                      {item.quantity}
                    </span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <h3>

                    Total:
                    {" "}
                    ₹{item.price * item.quantity}

                  </h3>

                </div>

                {/* ================= REMOVE ================= */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </button>

              </div>

            ))
          )}

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="summary-box">

          <h2>🧾 Bill Details</h2>

          <div className="summary-row">

            <span>Items</span>

            <span>
              {cartItems.length}
            </span>

          </div>

          <div className="summary-row">

            <span>Subtotal</span>

            <span>
              ₹{subtotal}
            </span>

          </div>

          <div className="summary-row">

            <span>Delivery Charges</span>

            <span>
              ₹{deliveryCharge}
            </span>

          </div>

          <div className="summary-row">

            <span>Platform Fee</span>

            <span>
              ₹{platformFee}
            </span>

          </div>

          <hr />

          <div className="summary-row total-row">

            <span>Total Amount</span>

            <span>
              ₹{finalTotal}
            </span>

          </div>

          {/* ================= CHECKOUT ================= */}

          <button

            className="checkout-btn"

            onClick={() => {

              localStorage.setItem(
                "subtotal",
                finalTotal
              );

              navigate("/payment");

            }}

          >

            Proceed to Checkout

          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;