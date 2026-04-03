const express = require("express");
const CorsMiddleware = require("../middleware/cors");
const response = require("../response/response");
const db = require("../db/database");
const app = express();
const nodemailer = require("nodemailer");
let tempToken = "";
const PORT = process.env.PORT || 4000;
const path = require("path");

// Tambah ini biar HTML bisa diakses
app.use(express.static(path.join(__dirname, "../../")));

app.use(CorsMiddleware);
app.use(express.json());

app.post("/signIn", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users_travel WHERE username = ? AND password = ?;";
  db.query(sql, [username, password], (err, field) => {
    if (err) return response(500, "server error", err, false, res);
    if (field.length > 0) {
      response(200, "login berhasil", field, true, res);
    } else {
      response(404, "username atau password salah", "", false, res);
    }
  });
});

app.post("/signUp", (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO users_travel (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, field) => {
    if (err) return response(500, "server error", err, false, res);
    if (field.affectedRows > 0) {
      response(200, "Akun berhasil di buat", field, true, res);
    } else {
      response(500, "username sudah ada", "", false, res);
    }
  });
});

// UNTUK SEND EMAIL
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "://gmail.com",
//   port: 465,
//   secure: true, // Pakai SSL
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS
//       ? process.env.GMAIL_PASS.replace(/\s+/g, "")
//       : "",
//     connectionTimeout: 10000, // 10 detik limit
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS ? process.env.GMAIL_PASS.replace(/\s+/g, "").trim() : ""
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
  dnsFaces: "v4" // PAKSA IPv4 BIAR GAK ENETUNREACH
});


app.post("/request-reset", (req, res) => {
  const { username } = req.body;

  db.query(
    "SELECT * FROM users_travel WHERE username = ?",
    [username],
    async (err, results) => {
      try {
        if (err || results.length === 0 || !results) {
          return response(404, "Email tidak valid", null, false, res);
        }

        const userEmail = results[0].username;
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        tempToken = token;

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: userEmail,
          subject: "Kode Verifikasi",
          html: `<strong>Kode kamu adalah: ${token}</strong>`,
        });

        res.json({ status: true, message: "Kode terkirim ke " + userEmail });
      } catch (e) {
        console.error(e);
        response(
          500,
          "Gagal mengirim verifikasi, masukan email yang valid",
          e,
          false,
          res,
        );
      }
    },
  );
});

// ENDPOINT 2: UPDATE PASSWORD
app.put("/changes", (req, res) => {
  const { username, password, verifInput } = req.body;

  // Cek apakah token cocok
  if (verifInput !== tempToken) {
    return res
      .status(400)
      .json({ status: false, message: "Kode verifikasi salah!" });
  }

  const sql = "UPDATE users_travel SET password = ? WHERE username = ?";
  db.query(sql, [password, username], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal update database" });

    tempToken = ""; // Hapus token agar tidak bisa dipakai 2x
    res.json({ status: true, message: "Password berhasil diperbarui!" });
  });
});

app.listen(PORT, () => {
  console.log(`port berjalan di port ${PORT}`);
});
