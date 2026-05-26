import "../App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Success() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/orders");

    }, 3000);

    return () => clearTimeout(timer);

  }, [navigate]);

  return (

    <div className="success-page">

      <div className="success-card">

        <div className="success-check">
          ✓
        </div>

        <h1>
          Payment Successful
        </h1>

        <p>
          Your order has been placed successfully.
        </p>

        <h3>
          Redirecting to orders...
        </h3>

      </div>

    </div>
  );
}

export default Success;