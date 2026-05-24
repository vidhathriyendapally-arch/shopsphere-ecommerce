import "../App.css";
import { useState, useEffect } from "react";

import {
  Bar,
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
 ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {

  const [dashboard, setDashboard] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [analytics, setAnalytics] =
    useState(null);

  /* ================= FORM STATES ================= */

  const [productName, setProductName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [image, setImage] =
    useState(null);

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

  /* ================= FETCH DASHBOARD ================= */

  const fetchDashboard = async () => {

    try {

      /* DASHBOARD */

      const dashboardRes = await fetch(
        "http://localhost:5000/admin/dashboard"
      );

      const dashboardData =
        await dashboardRes.json();

      setDashboard(dashboardData);

      setProducts(
        dashboardData.products || []
      );

      /* ANALYTICS */

      const analyticsRes = await fetch(
        "http://localhost:5000/admin/analytics"
      );

      const analyticsData =
        await analyticsRes.json();

      setAnalytics(analyticsData);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  /* ================= ADD PRODUCT ================= */

  const addProduct = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append(
        "product_name",
        productName
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "stock",
        stock
      );

      formData.append(
        "category_id",
        1
      );

      if (image) {

        formData.append(
          "image",
          image
        );
      }

      const res = await fetch(
        "http://localhost:5000/admin/add-product",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      alert(data.message);

      fetchDashboard();

      /* CLEAR FORM */

      setProductName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage(null);

    } catch (err) {

      console.log(err);

    }
  };

  /* ================= DELETE PRODUCT ================= */

  const deleteProduct = async (id) => {

    try {

      await fetch(
        `http://localhost:5000/admin/delete-product/${id}`,
        {
          method: "DELETE"
        }
      );

      alert("Product deleted");

      fetchDashboard();

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div className="admin-container">

      {/* ================= SIDEBAR ================= */}

      <div className="admin-sidebar">

        <h2>🛒 ShopSphere</h2>

        <button
          onClick={() =>
            setActiveSection("dashboard")
          }
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            setActiveSection("add")
          }
        >
          Add Product
        </button>

        <button
          onClick={() =>
            setActiveSection("products")
          }
        >
          All Products
        </button>

        <button
          onClick={() =>
            setActiveSection("analysis")
          }
        >
          Product Analysis
        </button>

        <button
          onClick={() =>
            setActiveSection("orders")
          }
        >
          User Orders
        </button>

      </div>

      {/* ================= MAIN ================= */}

      <div className="admin-main">

        {/* ================= DASHBOARD ================= */}

        {activeSection === "dashboard" && (

          <div>

            <h1>Admin Dashboard</h1>

            <div className="stats-grid">

              <div className="stat-card">
                <h3>Total Users</h3>
                <h1>
                  {dashboard?.totalUsers || 0}
                </h1>
              </div>

              <div className="stat-card">
                <h3>Total Orders</h3>
                <h1>
                  {dashboard?.totalOrders || 0}
                </h1>
              </div>

              <div className="stat-card">
                <h3>Total Revenue</h3>
                <h1>
                  ₹{dashboard?.totalRevenue || 0}
                </h1>
              </div>

              <div className="stat-card">
                <h3>Total Products</h3>
                <h1>
                  {products.length}
                </h1>
              </div>

            </div>

          </div>
        )}

        {/* ================= ADD PRODUCT ================= */}

        {activeSection === "add" && (

          <div className="add-product-form">

            <h2>Add Product</h2>

            <form onSubmit={addProduct}>

              <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) =>
                  setProductName(
                    e.target.value
                  )
                }
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="file"
                onChange={(e) =>
                  setImage(
                    e.target.files[0]
                  )
                }
                required
              />

              <button type="submit">
                Upload Product
              </button>

            </form>

          </div>
        )}

        {/* ================= PRODUCTS ================= */}

        {activeSection === "products" && (

          <div className="product-management">

            <h2>All Products</h2>

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {products.map((p) => (

                  <tr key={p.product_id}>

                    <td>{p.product_id}</td>

                    <td>

                      <img
                        src={
                          p.product_id <= 15
                            ? imageMap[p.product_name]
                            : `http://localhost:5000/uploads/${p.image}`
                        }

                        alt={p.product_name}

                        className="admin-product-img"
                      />

                    </td>

                    <td>{p.product_name}</td>

                    <td>₹{p.price}</td>

                    <td>{p.stock}</td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(
                            p.product_id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* ================= ANALYSIS ================= */}

        {activeSection === "analysis" ? (

          <div className="analysis-section">

            <h1>📊 Analytics Dashboard</h1>

            {/* TOP CARDS */}

            <div className="analysis-grid">

              <div className="analysis-card">
                <h3>Total Products</h3>
                <h1>{products.length}</h1>
              </div>

              <div className="analysis-card">
                <h3>Total Revenue</h3>
                <h1>
                  ₹{dashboard?.totalRevenue || 0}
                </h1>
              </div>

              <div className="analysis-card">
                <h3>Total Orders</h3>
                <h1>
                  {dashboard?.totalOrders || 0}
                </h1>
              </div>

              <div className="analysis-card">
                <h3>Total Users</h3>
                <h1>
                  {dashboard?.totalUsers || 0}
                </h1>
              </div>

            </div>

            {/* ================= CHARTS ================= */}

            <div className="charts-grid">

              {/* BAR CHART */}

              <div className="chart-card">

                <h2>📈 Monthly Orders</h2>

                <div className="chart-wrapper">

                  <Bar
                    data={{
                      labels:
                        analytics?.monthlySales?.length > 0
                          ? analytics.monthlySales.map(
                              (m) => `Month ${m.month}`
                            )
                          : ["No Data"],

                      datasets: [
                        {
                          label: "Orders",

                          data:
                            analytics?.monthlySales?.length > 0
                              ? analytics.monthlySales.map(
                                  (m) => m.total
                                )
                              : [0],

                          backgroundColor: [
                            "#3b82f6",
                            "#2563eb",
                            "#1d4ed8",
                            "#60a5fa"
                          ],

                          borderRadius: 10,
                          borderWidth: 1
                        }
                      ]
                    }}

                    options={{
                      responsive: true,
                      maintainAspectRatio: false,

                      plugins: {

                        legend: {
                          labels: {
                            color: "#e5e7eb"
                          }
                        },

                        tooltip: {
                          backgroundColor: "#111827",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff",
                          borderColor: "#3b82f6",
                          borderWidth: 1
                        }
                      },

                      scales: {

                        x: {

                          ticks: {
                            color: "#d1d5db"
                          },

                          grid: {
                            color: "rgba(255,255,255,0.08)"
                          }
                        },

                        y: {

                          beginAtZero: true,

                          ticks: {
                            color: "#d1d5db"
                          },

                          grid: {
                            color: "rgba(255,255,255,0.08)"
                          }
                        }
                      }
                    }}
                  />

                </div>

              </div>

              {/* PIE CHART */}

              <div className="chart-card">

                <h2>🔥 Top Selling Products</h2>

                <div className="pie-wrapper">

                  <Pie
                    data={{
                      labels:
                        analytics?.topProducts?.length > 0
                          ? analytics.topProducts.map(
                              (p) => p.product_name
                            )
                          : ["No Products"],

                      datasets: [
                        {
                          data:
                            analytics?.topProducts?.length > 0
                              ? analytics.topProducts.map(
                                  (p) => p.totalSold
                                )
                              : [1],

                          backgroundColor: [
                            "#2563eb",
                            "#16a34a",
                            "#dc2626",
                            "#ca8a04",
                            "#9333ea",
                            "#db2777"
                          ],

                          borderColor: "#ffffff",
                          borderWidth: 3
                        }
                      ]
                    }}

                    options={{
                      responsive: true,
                      maintainAspectRatio: false,

                      plugins: {

                        legend: {

                          position: "bottom",

                          labels: {
                            color: "#e5e7eb",
                            padding: 15
                          }
                        },

                        tooltip: {
                          backgroundColor: "#111827",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff"
                        }
                      }
                    }}
                  />

                </div>

              </div>

            </div>

            {/* ================= LOW STOCK ================= */}

            <div className="low-stock-section">

              <h2>⚠️ Low Stock Products</h2>

              <table>

                <thead>

                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                  </tr>

                </thead>

                <tbody>

                  {analytics?.lowStock?.map((p, index) => (

                    <tr key={index}>

                      <td>{p.product_name}</td>

                      <td className="low-stock">
                        {p.stock}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        ) : null}

        {/* ================= ORDERS ================= */}

        {activeSection === "orders" && (

          <div className="recent-orders-admin">

            <h2>User Orders</h2>

            <table>

              <thead>

                <tr>

                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>

                </tr>

              </thead>

              <tbody>

                {dashboard?.recentOrders?.map((o) => (

                  <tr key={o.order_id}>

                    <td>{o.order_id}</td>

                    <td>{o.customer}</td>

                    <td>{o.status}</td>

                    <td>₹{o.amount}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Admin;