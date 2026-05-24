import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const subtotal =
    Number(localStorage.getItem("subtotal")) || 5000;

  const delivery = 99;

  const platformFee = 29;

  const gst =
    Math.floor(subtotal * 0.18);

  const total =
    subtotal +
    delivery +
    platformFee +
    gst;

  /* HANDLE PAYMENT */

  const handlePayment = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const customer_id =
        localStorage.getItem("customer_id");

      const res = await fetch(
        "http://localhost:5000/order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            authorization: token
          },

          body: JSON.stringify({
            customer_id
          })
        }
      );

      const data = await res.json();

      alert(
        `Payment Successful ✅

Order ID: ${data.order_id}

Amount Paid: ₹${total}`
      );

      navigate("/success");

    } catch (err) {

      console.log(err);

      alert("Payment Failed ❌");
    }
  };

  return (

    <div className="payment-page">

      {/* HEADER */}

      <div className="payment-header">

        <h1>
          Secure Checkout 🔒
        </h1>

        <p>
          100% secure payments powered by
          ShopSphere Pay
        </p>

      </div>

      <div className="payment-layout">

        {/* LEFT SECTION */}

        <div className="payment-left">

          {/* ADDRESS */}

          <div className="payment-box">

            <h2>📍 Delivery Address</h2>

            <div className="address-card">

              <h3>
                {localStorage.getItem("name")}
              </h3>

              <p>
                {localStorage.getItem("address")}
              </p>

              <span>
                Phone:
                {" "}
                {localStorage.getItem("phone")}
              </span>

            </div>

          </div>

          {/* PAYMENT OPTIONS */}

          <div className="payment-box">

            <h2>💳 Payment Options</h2>

            {/* UPI */}

            <div
              className={
                paymentMethod === "UPI"
                  ? "payment-option active-payment"
                  : "payment-option"
              }
              onClick={() =>
                setPaymentMethod("UPI")
              }
            >

              <div className="payment-option-top">

                <h3>📱 UPI</h3>

                <span>
                  Google Pay / PhonePe / Paytm
                </span>

              </div>

              {paymentMethod === "UPI" && (

                <div className="payment-content">

                  <input
                    type="text"
                    placeholder="Enter UPI ID"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(e.target.value)
                    }
                    className="payment-input"
                  />

                </div>

              )}

            </div>

            {/* CARD */}

            <div
              className={
                paymentMethod === "CARD"
                  ? "payment-option active-payment"
                  : "payment-option"
              }
              onClick={() =>
                setPaymentMethod("CARD")
              }
            >

              <div className="payment-option-top">

                <h3>💳 Credit / Debit Card</h3>

                <span>
                  Visa / Mastercard / RuPay
                </span>

              </div>

              {paymentMethod === "CARD" && (

                <div className="payment-content">

                  <input
                    type="text"
                    placeholder="Card Number"
                    className="payment-input"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    className="payment-input"
                    value={cardName}
                    onChange={(e) =>
                      setCardName(e.target.value)
                    }
                  />

                  <div className="card-flex">

                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="payment-input"
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(e.target.value)
                      }
                    />

                    <input
                      type="password"
                      placeholder="CVV"
                      className="payment-input"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value)
                      }
                    />

                  </div>

                </div>

              )}

            </div>

            {/* COD */}

            <div
              className={
                paymentMethod === "COD"
                  ? "payment-option active-payment"
                  : "payment-option"
              }
              onClick={() =>
                setPaymentMethod("COD")
              }
            >

              <div className="payment-option-top">

                <h3>
                  📦 Cash On Delivery
                </h3>

                <span>
                  Pay after delivery
                </span>

              </div>

            </div>

            {/* NET BANKING */}

            <div
              className={
                paymentMethod === "BANKING"
                  ? "payment-option active-payment"
                  : "payment-option"
              }
              onClick={() =>
                setPaymentMethod("BANKING")
              }
            >

              <div className="payment-option-top">

                <h3>🏦 Net Banking</h3>

                <span>
                  All Indian banks supported
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="payment-right">

          <div className="order-summary">

            <h2>🧾 Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>₹{delivery}</span>
            </div>

            <div className="summary-row">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            <button
              className="pay-now-btn"
              onClick={handlePayment}
            >
              🔒 Pay ₹{total}
            </button>

            <div className="secure-payment">

              <p>
                🔐 Secure Payments
              </p>

              <span>
                Your payment information is
                encrypted and secure.
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payment;