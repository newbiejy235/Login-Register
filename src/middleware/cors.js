const cors = require("cors");

const corsOptions = {
  origin: [
    "https://login-register-production-af71.up.railway.app/",
    "https://login-register-production-af71.up.railway.app/recov.html",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

module.exports = cors(corsOptions);
