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

function Wishlist() {

  const [wishlist, setWishlist] = useState([]);

  /* ================= LOAD WISHLIST ================= */

  useEffect(() => {

    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);

  }, []);

  /* ================= REMOVE ================= */

  const removeFromWishlist = (id) => {

    const updatedWishlist =
      wishlist.filter(
        (item) => item.product_id !== id
      );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);
  };

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

  return (

    <div className="wishlist-page">

      <h1 className="wishlist-title">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <h2>No wishlist items ❌</h2>

        </div>

      ) : (

        <div className="wishlist-grid">

          {wishlist.map((item) => (

            <div
              className="wishlist-card"
              key={item.product_id}
            >

              {/* IMAGE */}

              <img
                src={
                  item.product_id <= 15
                    ? imageMap[item.product_name]
                    : `https://shopsphere-ecommerce-az26.onrender.com/uploads/${item.image}`
                }

                alt={item.product_name}

                className="wishlist-image"
              />

              {/* DETAILS */}

              <h2>{item.product_name}</h2>

              <h3>₹{item.price}</h3>

              {/* BUTTON */}

              <button
                className="remove-wishlist-btn"
                onClick={() =>
                  removeFromWishlist(item.product_id)
                }
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Wishlist;