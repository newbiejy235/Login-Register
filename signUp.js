async function getDataUp() {
  const userInput = document.getElementById("username").value;
  const passInput = document.getElementById("password").value;
  if (!userInput || !passInput) return alert("tidak boleh kosong");

  try {
    const res = await fetch("http://localhost:4000/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userInput, password: passInput }),
    });

    const data = await res.json();

    if (data.status) {
      alert("Akun berhasil di buat");
    } else {
      alert("Akun gagal di buat, username sudah ada");
    }
  } catch (error) {
    console.error("Gagal koneksi:", error);
    alert("Gagal terhubung ke server. Pastikan backend sudah jalan.");
  }
}