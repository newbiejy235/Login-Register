require("dotenv").config();
const mysql2 = require("mysql2");
const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false, // Memungkinkan koneksi SSL di Railway
  },
  waitForConnections: true,
  connectionLimit: 10,
});

// Test koneksi saat server baru nyala
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ GAGAL KONEK DATABASE:", err.message);
  } else {
    console.log("✅ DATABASE BERHASIL TERHUBUNG!");
    connection.release();
  }
});

module.exports = db;
