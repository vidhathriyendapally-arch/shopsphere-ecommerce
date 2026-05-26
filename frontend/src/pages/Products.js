import { toast } from "react-toastify";
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

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {

    fetch("https://your-render-backend-url.onrender.com/products")

      .then((res) => res.json())

      .then((data) => {

        setTimeout(() => {

          setProducts(Array.isArray(data) ? data : []);

          setLoading(false);

        }, 1000);

      })

      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);

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

  /* ================= CATEGORIES ================= */

  const categories = [

    "All",
    "Electronics",
    "Fashion",
    "Books",
    "Appliances"

  ];

  /* ================= WISHLIST ================= */

  const addToWishlist = (product) => {

    const existingWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = existingWishlist.find(
      (item) => item.product_id === product.product_id
    );

    if (alreadyExists) {

      toast.error("Already in wishlist ❤️");

      return;
    }

    const updatedWishlist = [
      ...existingWishlist,
      product
    ];

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    toast.success("Added to wishlist ❤️");
  };

  /* ================= ADD TO CART ================= */

  const addToCart = async (product_id) => {

    const token = localStorage.getItem("token");

    if (!token) {

      toast.error("Please login first ❌");

      return;
    }

    try {

      const res = await fetch(
        "https://your-render-backend-url.onrender.com/cart/add",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            authorization: token

          },

          body: JSON.stringify({

            customer_id:
              localStorage.getItem("customer_id"),

            product_id,

            quantity: 1

          })

        }
      );

      const data = await res.json();

      if (res.ok) {

        toast.success(data.message);

      } else {

        toast.error(data.message);

      }

    } catch (err) {

      console.log(err);

      toast.error("Error adding to cart ❌");

    }
  };

  /* ================= CATEGORY FILTER ================= */

  const getCategory = (productName) => {

    if (
      productName.includes("Book")
    ) {
      return "Books";
    }

    if (
      productName.includes("Shirt") ||
      productName.includes("Jeans") ||
      productName.includes("Jacket") ||
      productName.includes("Kurti")
    ) {
      return "Fashion";
    }

    if (
      productName.includes("AC") ||
      productName.includes("Fridge") ||
      productName.includes("Mixer")
    ) {
      return "Appliances";
    }

    return "Electronics";
  };

  return (

    <div className="products-page">

      <div className="products-layout">

        {/* ================= SIDEBAR ================= */}

        <div className="category-sidebar">

          <h2>Categories</h2>

          {categories.map((category) => (

            <button
              key={category}

              className={
                selectedCategory === category
                  ? "active-category"
                  : ""
              }

              onClick={() =>
                setSelectedCategory(category)
              }
            >

              {category}

            </button>

          ))}

        </div>

        {/* ================= PRODUCTS ================= */}

        <div className="products-content">

          <h1>🛍️ Products</h1>

          {/* SEARCH */}

          <div className="search-container">

            <input
              type="text"

              placeholder="Search products..."

              className="search-input"

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* LOADER */}

          {loading ? (

            <div className="loader-container">

              <div className="loader"></div>

            </div>

          ) : (

            <div className="product-grid">

              {products

                .filter((p) => {

                  const matchesSearch =
                    p.product_name
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      );

                  const category =
                    getCategory(p.product_name);

                  const matchesCategory =
                    selectedCategory === "All" ||
                    category === selectedCategory;

                  return (
                    matchesSearch &&
                    matchesCategory
                  );
                })

                .map((p) => (

                  <div
                    key={p.product_id}
                    className="product-card"
                  >

                    {/* IMAGE */}

                    <img

                    src={
                      p.product_id <= 15
                        ? imageMap[p.product_name]
                        : `https://your-render-backend-url.onrender.com/uploads/${p.image}`
                    }

                    alt={p.product_name}

                    className="product-image"
                  />

             

                    {/* DETAILS */}

                    <h3>{p.product_name}</h3>

                    <p>{p.description}</p>

                    <h4>₹{p.price}</h4>

                    {/* BUTTONS */}

                    <div className="product-buttons">

                      <button
                        onClick={() =>
                          addToCart(p.product_id)
                        }
                      >
                        Add to Cart
                      </button>

                      <button
                        className="wishlist-btn"

                        onClick={() =>
                          addToWishlist(p)
                        }
                      >
                        ❤️
                      </button>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Products;