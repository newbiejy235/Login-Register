const SEND = document.getElementById("SEND");
SEND.addEventListener("click", async (e) => {
  e.preventDefault();

  const userInput = document.getElementById("username").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userInput)) {
    return alert("Format email tidak valid!");
  }

  // Validasi harus gmail
  if (!userInput.endsWith("@gmail.com")) {
    return alert("Harus menggunakan email Gmail!");
  }

  // Panggil endpoint kirim email
  const response = await fetch("http://localhost:4000/request-reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: userInput }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Cek email kamu untuk kode verifikasi!");
  } else {
    alert(data.message); // Akan tampil "User tidak ditemukan"
  }
});

async function getVerif() {
  const userInput = document.getElementById("username").value;
  const passInput = document.getElementById("password").value;
  const verifInput = document.getElementById("verify").value;
  if (!userInput || !passInput || !verifInput)
    return alert("please fill in all columns");

  try {
    const URL = "http://localhost:4000/changes";
    const response = await fetch(URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userInput,
        password: passInput,
        verifInput: verifInput,
      }),
    });
    const datas = await response.json();

    if (datas.status) {
      alert("Password berhasil diganti");
    } else {
      alert("Gagal mengubah");
    }
  } catch (error) {
    console.error("koneksi gagal", error);
  }
}
