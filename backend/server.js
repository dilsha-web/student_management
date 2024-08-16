const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "studentManagement",
});

// Handle data insert
app.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = "INSERT INTO students (`Name`, `Email`, `Password`) VALUES (?)";
    const student = [name, email, hashedPassword];

    db.query(sql, [student], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json(result);
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Handle data view
app.get("/", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(data);
  });
});

// Handle edit data
app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM students WHERE ID=?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(result);
  });
});

// Handle update data
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql =
      "UPDATE students SET `Name`=?, `Email`=?, `Password`=? WHERE ID=?";

    db.query(sql, [name, email, hashedPassword, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json(result);
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Handle delete data
app.delete("/delete/:id", (req, res) => {
  const sql = "DELETE FROM students WHERE ID=?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(result);
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
