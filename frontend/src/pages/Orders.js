import { useEffect, useState } from "react";
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

function Orders() {

  const [orders, setOrders] = useState([]);

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

  /* ================= LOAD ORDERS ================= */

  const loadOrders = async () => {

    try {

      const res = await fetch(
        `http://your-render-backend-url.onrender.com/orders/${customerId}`,
        {
          headers: {
            authorization: token
          }
        }
      );

      const data = await res.json();

      /* ================= GROUP ORDERS ================= */

      const groupedOrders = {};

      data.forEach((item) => {

        if (!groupedOrders[item.order_id]) {

          groupedOrders[item.order_id] = {

            order_id: item.order_id,
            order_date: item.order_date,
            status: item.status,
            products: []

          };
        }

        groupedOrders[item.order_id].products.push({

          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          image: item.image

        });

      });

      setOrders(
        Object.values(groupedOrders)
      );

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    loadOrders();

  }, []);

  return (

    <div className="orders-page">

      <h1 className="orders-title">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="empty-orders">

          <h2>No Orders Found ❌</h2>

        </div>

      ) : (

        orders.map((order, index) => (

          <div
            className="premium-order-card"
            key={order.order_id}
          >

            {/* ================= TOP SECTION ================= */}

            <div className="premium-order-top">

              <div>

                <h4>Order ID</h4>

                <p>
                  #{order.order_id}
                </p>

              </div>

              <div>

                <h4>Tracking ID</h4>

                <p>
                  TRK{order.order_id}X9A{index + 100}
                </p>

              </div>

              <div>

                <h4>Order Date</h4>

                <p>
                  {new Date(
                    order.order_date
                  ).toLocaleDateString()}
                </p>

              </div>

              <div>

                <h4>Status</h4>

                <span className="premium-status">
                  {order.status}
                </span>

              </div>

            </div>

            {/* ================= PRODUCTS ================= */}

            <div className="ordered-products">

              {order.products.map(
                (product, index) => (

                <div
                  className="ordered-product-card"
                  key={index}
                >

                  {/* ================= IMAGE ================= */}

                  <img
                    src={
                      product.product_id <= 15
                        ? imageMap[product.product_name]
                        : `http://your-render-backend-url.onrender.com/uploads/${product.image}`
                    }

                    alt={product.product_name}

                    className="ordered-image"
                  />

                  {/* ================= DETAILS ================= */}

                  <div className="ordered-details">

                    <h2>
                      {product.product_name}
                    </h2>

                    <p>
                      Your order has been confirmed
                      and is being prepared for shipment.
                    </p>

                    <h4>
                      Quantity:
                      {" "}
                      {product.quantity}
                    </h4>

                    <h4>
                      Price:
                      {" "}
                      ₹{product.price}
                    </h4>

                    <h3>
                      Total:
                      {" "}
                      ₹{product.total}
                    </h3>

                    <h4>

                      Expected Delivery:

                      <span>

                        {" "}

                        {new Date(

                          new Date(
                            order.order_date
                          ).getTime() +

                          5 *
                          24 *
                          60 *
                          60 *
                          1000

                        ).toLocaleDateString()}

                      </span>

                    </h4>

                  </div>

                </div>

              ))}

            </div>

            {/* ================= TRACKING ================= */}

            <div className="tracking-container">

              <div className="tracking-step active">
                <div className="circle"></div>
                <p>Ordered</p>
              </div>

              <div className="tracking-line active-line"></div>

              <div className="tracking-step active">
                <div className="circle"></div>
                <p>Packed</p>
              </div>

              <div className="tracking-line active-line"></div>

              <div className="tracking-step active">
                <div className="circle"></div>
                <p>Shipped</p>
              </div>

              <div className="tracking-line"></div>

              <div className="tracking-step">
                <div className="circle"></div>
                <p>Delivered</p>
              </div>

            </div>

            {/* ================= BOTTOM ================= */}

            <div className="order-bottom">

              <div>

                <h4>Delivery Partner</h4>

                <p>
                  ShopSphere Express
                </p>

              </div>

              <div>

                <h4>Payment</h4>

                <p>
                  Online Payment ✅
                </p>

              </div>

              <div>

                <h4>Total Amount</h4>

                <p className="amount">

                  ₹{
                    order.products.reduce(

                      (sum, item) =>

                        sum + Number(item.total),

                      0
                    )
                  }

                </p>

              </div>

            </div>

          </div>

        ))
      )}

    </div>
  );
}

export default Orders;