// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------
// Database setup
// ----------------------
const db = new sqlite3.Database("./database.db");

// Records table
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

// Activity logs table
db.run(`
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    action TEXT,
    details TEXT,
    createdAt INTEGER
  )
`);

// ----------------------
// Helper: log activity
// ----------------------
function logActivity(username, action, details = "") {
  const createdAt = Date.now();
  db.run(
    `
    INSERT INTO activity_logs (username, action, details, createdAt)
    VALUES (?, ?, ?, ?)
    `,
    [username, action, details, createdAt],
    (err) => {
      if (err) console.error("❌ Activity log error:", err.message);
    }
  );
}

// ----------------------
// Multer setup for file uploads
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ----------------------
// Routes
// ----------------------

// Add a new record
app.post("/records", upload.single("file"), (req, res) => {
  const { recordNo, dateReceived, from, to, subject, route, username } = req.body;
  const fileName = req.file.filename;
  const createdAt = Date.now();

  db.run(
    `
    INSERT INTO records
    (recordNo, dateReceived, fromOffice, toOffice, subject, route, fileName, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [recordNo, dateReceived, from, to, subject, route, fileName, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Log activity
      logActivity(username, "ADD RECORD", `Record No: ${recordNo}`);

      res.json({ success: true, id: this.lastID });
    }
  );
});

// Get all records
app.get("/records", (req, res) => {
  db.all("SELECT * FROM records ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Delete a record
app.delete("/records/:id", (req, res) => {
  const { id } = req.params;
  const { username } = req.query;

  db.get("SELECT recordNo, fileName FROM records WHERE id = ?", [id], (err, row) => {
    if (!row) return res.sendStatus(404);

    const filePath = path.join(__dirname, "uploads", row.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    db.run("DELETE FROM records WHERE id = ?", [id], () => {
      logActivity(username, "DELETE RECORD", `Record No: ${row.recordNo}`);
      res.json({ success: true });
    });
  });
});

// Log record VIEW
app.post("/activity/view", (req, res) => {
  const { username, recordNo } = req.body;
  logActivity(username, "VIEW RECORD", `Record No: ${recordNo}`);
  res.json({ success: true });
});

// Log record DOWNLOAD
app.post("/activity/download", (req, res) => {
  const { username, fileName } = req.body;
  logActivity(username, "DOWNLOAD FILE", fileName);
  res.json({ success: true });
});

// Get activity logs (for admin / secret page)
app.get("/activity-logs", (req, res) => {
  db.all("SELECT * FROM activity_logs ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ----------------------
// Log cleanup (auto delete old logs)
// ----------------------
const LOG_RETENTION_DAYS = 10; // configurable

function cleanupOldLogs() {
  const cutoff = Date.now() - LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  db.run("DELETE FROM activity_logs WHERE createdAt < ?", [cutoff], (err) => {
    if (err) console.error("Cleanup error:", err.message);
    else console.log("🧹 Old activity logs cleaned");
  });
}

// Run every hour
setInterval(cleanupOldLogs, 60 * 60 * 1000);
cleanupOldLogs(); // run at server start

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
