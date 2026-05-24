import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from "react-router-dom";

import { useState, useEffect } from "react";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

/* ================= NAVBAR ================= */
function Navbar() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const userName =
    localStorage.getItem("name");

  const isAdmin =
    localStorage.getItem("isAdmin") === "true";

  useEffect(() => {

    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener(
      "storage",
      checkToken
    );

    checkToken();

    return () => {

      window.removeEventListener(
        "storage",
        checkToken
      );

    };

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("customer_id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("phone");
    localStorage.removeItem("address");
    localStorage.removeItem("isAdmin");

    setToken(null);

    toast.success(
      "Logged out successfully ✅"
    );

    window.location.href = "/login";
  };

  return (

    <nav className="navbar">

      <h2 className="logo">
        ShopSphere
      </h2>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        {token && (
          <>

            <Link to="/cart">
              Cart
            </Link>

            <Link to="/wishlist">
              Wishlist
            </Link>

            <Link to="/orders">
              Orders
            </Link>

            <Link to="/profile">
              👤 {userName || "Profile"}
            </Link>

            {isAdmin && (

              <Link to="/admin">
                Admin
              </Link>

            )}

          </>
        )}

        {!token ? (

          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Signup
            </Link>
          </>

        ) : (

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        )}

      </div>

    </nav>
  );
}

/* ================= HOME ================= */

function Home() {

  return (

    <div className="container">

      <h1>
        Welcome to ShopSphere 🛒
      </h1>

      <p>
        Your one-stop shopping platform
      </p>

    </div>
  );
}

/* ================= LOGIN ================= */

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      console.log(data);

      if (data.token) {

        /* SAVE USER DETAILS */

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "customer_id",
          data.user.customer_id
        );

        localStorage.setItem(
          "email",
          data.user.email
        );

        localStorage.setItem(
          "name",
          `${data.user.first_name} ${data.user.last_name}`
        );

        localStorage.setItem(
          "phone",
          data.user.phone ||
          "+91 9876543210"
        );

        localStorage.setItem(
          "address",
          data.user.address ||
          "Hyderabad, India"
        );
        if (
  email === "admin@shopsphere.com"
) {

  localStorage.setItem(
    "isAdmin",
    "true"
  );

} else {

  localStorage.setItem(
    "isAdmin",
    "false"
  );

}

        toast.success(
          "Login successful ✅"
        );

        navigate("/products");

        window.location.reload();

      } else {

        toast.error(
          data.message ||
          "Login failed ❌"
        );

      }

    } catch (err) {

      console.log(err);

      toast.error("Server error ❌");

    }
  };

  return (

    <div className="form-container">

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

/* ================= SIGNUP ================= */

function Signup() {

  const [first_name, setFirst] =
    useState("");

  const [last_name, setLast] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/signup",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            first_name,
            last_name,
            email,
            password
          })
        }
      );

      const data = await res.json();

      toast.success(data.message);

      if (data.user_id) {

        navigate("/login");

      }

    } catch (err) {

      console.log(err);

      toast.error("Signup failed ❌");

    }
  };

  return (

    <div className="form-container">

      <h2>Signup</h2>

      <input
        placeholder="First Name"
        onChange={(e) =>
          setFirst(e.target.value)
        }
      />

      <input
        placeholder="Last Name"
        onChange={(e) =>
          setLast(e.target.value)
        }
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleSignup}>
        Signup
      </button>

    </div>
  );
}

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

/* ================= APP ================= */

function App() {

  return (

    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
      />

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
  path="/payment"
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  }
/>
        <Route
  path="/success"
  element={<Success />}
/>
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;

