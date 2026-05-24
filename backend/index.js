const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO customers (first_name, last_name, email)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [first_name, last_name, email], (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Signup failed ❌");
      }

      res.json({ message: "User registered ✅" });
    });

  } catch (err) {
    res.send("Error hashing password ❌");
  }
});
