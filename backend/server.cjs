const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database
const db = new sqlite3.Database("./database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recordNo TEXT,
    dateReceived TEXT,
    fromOffice TEXT,
    toOffice TEXT,
    subject TEXT,
    route TEXT,
    fileName TEXT,
    createdAt INTEGER
  )
`);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/records", upload.single("file"), (req, res) => {
  const {
    recordNo,
    dateReceived,
    from,
    to,
    subject,
    route,
  } = req.body;

  const fileName = req.file.filename;
  const createdAt = Date.now();

  db.run(
    `
    INSERT INTO records
    (recordNo, dateReceived, fromOffice, toOffice, subject, route, fileName, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      recordNo,
      dateReceived,
      from,
      to,
      subject,
      route,
      fileName,
      createdAt,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get("/records", (req, res) => {
  db.all(
    "SELECT * FROM records ORDER BY createdAt DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

const fs = require("fs");

app.delete("/records/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT fileName FROM records WHERE id = ?", [id], (err, row) => {
    if (!row) return res.sendStatus(404);

    const filePath = path.join(__dirname, "uploads", row.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    db.run("DELETE FROM records WHERE id = ?", [id], () => {
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

