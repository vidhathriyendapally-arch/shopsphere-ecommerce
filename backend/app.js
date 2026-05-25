require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Access denied ❌");
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    // 🔥 CHECK ADMIN ROLE
    if (decoded.role !== "admin") {
      return res.status(403).send("Admins only ❌");
    }

    next();

  } catch (err) {
    return res.status(401).send("Invalid token ❌");
  }
};
const SECRET = process.env.JWT_SECRET;
/* ================= IMAGE UPLOAD ================= */



const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      path.join(__dirname, "uploads")
    );

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({ storage });


/* SERVE IMAGES */
app.get("/", (req, res) => {
  res.send("ShopSphere Backend API Running 🚀");
});


app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

app.use("/uploads", express.static("uploads"));

/* ================== JWT MIDDLEWARE ================== */

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).send("Access denied ❌");

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token ❌");

    req.user = decoded;
    next();
  });
};

/* ================== PRODUCTS ================== */
/* ================== PRODUCTS ================== */

app.get("/products", (req, res) => {

  const sql = `
    SELECT 
      product_id,
      product_name,
      description,
      price,
      image
    FROM products
    ORDER BY product_id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(result);

  });

});





  
app.get("/products/category/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE category_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/products/search", (req, res) => {
  const query = `%${req.query.q}%`;

  db.query(
    "SELECT * FROM products WHERE product_name LIKE ?",
    [query],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ================== AUTH ================== */

// SIGNUP
app.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUser = "SELECT * FROM customers WHERE email = ?";

    db.query(checkUser, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server error ❌");
      }

      // 🚨 Prevent duplicate users
      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists ❌" });
      }

      const insertUser = `
        INSERT INTO customers (first_name, last_name, email, password)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertUser,
        [first_name, last_name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.log("INSERT ERROR:", err);
            return res.status(500).send("Signup failed ❌");
          }

          res.json({
            message: "User registered successfully ✅",
            user_id: result.insertId
          });
        }
      );
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error ❌");
  }
});
// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM customers WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).send("Server error ❌");

      if (result.length === 0) {
        return res.status(401).send("User not found ❌");
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).send("Wrong password ❌");
      }
      const token = jwt.sign(
          {
            id: user.customer_id,
            role: user.role   // 👈 ADD THIS LINE
          },
          SECRET,
          { expiresIn: "1h" }
        );
      
      res.json({
        message: "Login successful ✅",
        token,
        user
      });
    }
  );
});

/* ================== CART ================== */

// ADD TO CART
app.post("/cart/add", verifyToken, (req, res) => {
  const { customer_id, product_id, quantity } = req.body;

  const sql = `
    INSERT INTO cart (customer_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [customer_id, product_id, quantity], (err) => {
    if (err) {
       console.log(err);
       return res.status(500).json(err);
    }
    res.json({ message: "Added to cart ✅" });
  });
});

// VIEW CART

app.get("/cart/:customerId", verifyToken, (req, res) => {

  const sql = `

    SELECT
      c.id,
      c.quantity,

      p.product_id,
      p.product_name,
      p.price,
      p.image

    FROM cart c

    JOIN products p
    ON c.product_id = p.product_id

    WHERE c.customer_id = ?

  `;

  db.query(sql, [req.params.customerId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});
// UPDATE
app.put("/cart/update", verifyToken, (req, res) => {
  const { id, quantity } = req.body;

  db.query(
    "UPDATE cart SET quantity = ? WHERE id = ?",
    [quantity, id],
    (err, result) => {
      if (err) return res.status(500).send("Error ❌");

      if (result.affectedRows === 0) {
        return res.send("Item not found ❌");
      }

      res.json({ message: "Updated ✅" });
    }
  );
});

// DELETE
app.delete("/cart/remove/:cartId", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM cart WHERE id = ?",
    [req.params.cartId],
    (err, result) => {
      if (err) return res.status(500).send("Error ❌");

      if (result.affectedRows === 0) {
        return res.send("Item not found ❌");
      }

      res.json({ message: "Removed ✅" });
    }
  );
});

// TOTAL
app.get("/cart/total/:customerId", verifyToken, (req, res) => {
  const sql = `
    SELECT SUM(p.price * c.quantity) AS total
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.customer_id = ?
  `;

  db.query(sql, [req.params.customerId], (err, result) => {
    if (err) return res.status(500).send("Error ❌");

    res.json({
      total: result[0].total ? Number(result[0].total) : 0
    });
  });
});

/* ================== ORDER ================== */

app.post("/order", verifyToken, (req, res) => {
  const { customer_id } = req.body;

  const getCart = `
    SELECT c.product_id, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.customer_id = ?
  `;

  db.query(getCart, [customer_id], (err, cartItems) => {
    if (err) return res.send("Error ❌");

    if (cartItems.length === 0) {
      return res.send("Cart empty ❌");
    }

    let total = 0;
    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });

    db.query(
      "INSERT INTO orders (customer_id, order_date, status) VALUES (?, NOW(), 'Placed')",
      [customer_id],
      (err, orderResult) => {
        if (err) return res.send("Order failed ❌");

        const orderId = orderResult.insertId;

        const insertItem = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `;

        cartItems.forEach(item => {
          db.query(insertItem, [
            orderId,
            item.product_id,
            item.quantity,
            item.price
          ]);
        });

        db.query("DELETE FROM cart WHERE customer_id = ?", [customer_id]);

        res.json({
          message: "Order placed ✅",
          order_id: orderId,
          total
        });
      }
    );
  });
});

// ORDERS LIST
app.get("/orders/:customerId", verifyToken, (req, res) => {

  const customerId = req.params.customerId;

  const sql = `
    SELECT 

      o.order_id,
      o.order_date,
      o.status,

      p.product_id,
      p.product_name,
      p.price,
      p.image,

      oi.quantity,

      (oi.quantity * p.price) AS total

    FROM orders o

    JOIN order_items oi
      ON o.order_id = oi.order_id

    JOIN products p
      ON oi.product_id = p.product_id

    WHERE o.customer_id = ?

    ORDER BY o.order_date DESC
  `;

  db.query(sql, [customerId], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).send("Error ❌");

    }

    res.json(result);

  });

});
// ORDER DETAILS
app.get("/order/:orderId", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      oi.order_item_id,
      p.product_name,
      oi.quantity,
      oi.price,
      (oi.quantity * oi.price) AS total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
  `;

  db.query(sql, [req.params.orderId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================== SERVER ================== */

db.query("SELECT DATABASE()", (err, result) => {
  console.log("CONNECTED DB:", result);
});




/* ================= ADMIN DASHBOARD API ================= */
/* ================= ADMIN DASHBOARD ================= */
app.get("/admin/dashboard", async (req, res) => {
  try {

    const [users] = await db.promise().query(`
      SELECT COUNT(*) AS totalUsers FROM customers
    `);

    const [orders] = await db.promise().query(`
      SELECT COUNT(*) AS totalOrders FROM orders
    `);

    const [revenue] = await db.promise().query(`
      SELECT IFNULL(SUM(amount),0) AS totalRevenue 
      FROM payments 
      WHERE payment_status='Completed'
    `);

    const [products] = await db.promise().query(`
  SELECT 
    p.product_id,
    p.product_name,
    p.price,
    p.image,
    i.stock

  FROM products p

  JOIN inventory i
    ON p.product_id = i.product_id

  ORDER BY p.product_id DESC
`);

    const [recentOrders] = await db.promise().query(`
      SELECT
        o.order_id,
        CONCAT(c.first_name,' ',c.last_name) AS customer,
        o.status,
        IFNULL(SUM(oi.price * oi.quantity),0) AS amount
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id
      ORDER BY o.order_id DESC
      LIMIT 5
    `);

    res.json({
      totalUsers: users[0].totalUsers,
      totalOrders: orders[0].totalOrders,
      totalRevenue: revenue[0].totalRevenue,
      products,
      recentOrders
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= ADD PRODUCT ================= */
/* ================= ADD PRODUCT ================= */

app.post(
  "/admin/add-product",
  upload.single("image"),
  async (req, res) => {

    try {

      const {
        product_name,
        description,
        price,
        category_id,
        stock
      } = req.body;

      const image = req.file.filename;

      const [result] =
        await db.promise().query(

          `
          INSERT INTO products
          (
            product_name,
            description,
            price,
            category_id,
            image
          )

          VALUES (?, ?, ?, ?, ?)
          `,

          [
            product_name,
            description,
            price,
            category_id,
            image
          ]
        );

      await db.promise().query(

        `
        INSERT INTO inventory
        (
          product_id,
          stock,
          warehouse_location
        )

        VALUES (?, ?, 'Hyderabad')
        `,

        [
          result.insertId,
          stock
        ]
      );

      res.json({
        message: "Product added successfully"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Error adding product"
      });

    }

  }
);



/* ================= DELETE PRODUCT ================= */

app.delete("/admin/delete-product/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await db.promise().query(
      "DELETE FROM inventory WHERE product_id=?",
      [id]
    );

    await db.promise().query(
      "DELETE FROM products WHERE product_id=?",
      [id]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting" });
  }

});

/* ================= ANALYTICS API ================= */

app.get("/admin/analytics", async (req, res) => {

  try {

    /* TOTAL REVENUE */

    const [revenue] = await db.promise().query(`
      SELECT 
        IFNULL(SUM(oi.price * oi.quantity),0)
        AS totalRevenue
      FROM order_items oi
    `);

    /* TOTAL ORDERS */

    const [orders] = await db.promise().query(`
      SELECT COUNT(*) AS totalOrders
      FROM orders
    `);

    /* TOP SELLING PRODUCTS */

    const [topProducts] = await db.promise().query(`
      SELECT 
        p.product_name,
        SUM(oi.quantity) AS totalSold
      FROM order_items oi
      JOIN products p
      ON oi.product_id = p.product_id
      GROUP BY p.product_id
      ORDER BY totalSold DESC
      LIMIT 5
    `);

    /* LOW STOCK PRODUCTS */

    const [lowStock] = await db.promise().query(`
      SELECT 
        p.product_name,
        i.stock
      FROM inventory i
      JOIN products p
      ON i.product_id = p.product_id
      WHERE i.stock < 5
    `);

    /* MONTHLY SALES */

    const [monthlySales] = await db.promise().query(`
      SELECT 
        MONTH(order_date) AS month,
        COUNT(*) AS total
      FROM orders
      GROUP BY MONTH(order_date)
      ORDER BY month
    `);

    res.json({

      totalRevenue:
        revenue[0].totalRevenue,

      totalOrders:
        orders[0].totalOrders,

      topProducts,

      lowStock,

      monthlySales

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Analytics error"
    });

  }

});