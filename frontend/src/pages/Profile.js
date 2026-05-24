import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Profile() {

  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("name") || ""
  );

  const [email] = useState(
    localStorage.getItem("email") || ""
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || ""
  );

  const [address, setAddress] = useState(
    localStorage.getItem("address") || ""
  );

  /* SAVE PROFILE */

  const saveProfile = () => {

    localStorage.setItem("name", name);

    localStorage.setItem("phone", phone);

    localStorage.setItem("address", address);

    alert("Profile updated successfully ✅");

    window.location.reload();
  };

  return (

    <div className="profile-page">

      {/* TOP */}

      <div className="profile-top-card">

        <div className="profile-avatar">
          {name.charAt(0)}
        </div>

        <div>

          <h1>{name}</h1>

          <p>{email}</p>

        </div>

      </div>

      {/* GRID */}

      <div className="profile-grid">

        {/* PERSONAL INFO */}

        <div className="profile-card">

          <h2>👤 Personal Information</h2>

          <div className="profile-form">

            <label>Full Name</label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <label>Email</label>

            <input
              value={email}
              disabled
            />

            <label>Phone</label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

          </div>

        </div>

        {/* ADDRESS */}

        <div className="profile-card">

          <h2>📍 Saved Address</h2>

          <textarea
            className="address-box"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
          />

        </div>

        {/* ORDERS */}

        <div
          className="profile-card clickable-card"
          onClick={() => navigate("/orders")}
        >

          <h2>📦 Orders</h2>

          <p>
            Track your ordered products,
            delivery status and invoices.
          </p>

        </div>

        {/* WISHLIST */}

        <div
          className="profile-card clickable-card"
          onClick={() => navigate("/wishlist")}
        >

          <h2>❤️ Wishlist</h2>

          <p>
            Your favorite saved products
            appear here.
          </p>

        </div>

      </div>

      {/* SAVE BUTTON */}

      <button
        className="save-profile-btn"
        onClick={saveProfile}
      >
        Save Changes
      </button>

    </div>
  );
}

export default Profile;