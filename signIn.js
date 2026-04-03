const checkbox = document.getElementById("menu-toggle");
const toggleText = document.getElementById("toggleText");
const mainButton = document.getElementById("mainButton");
const secondButton = document.getElementById("secondButton");

const userInput = document.getElementById("username");
const passInput = document.getElementById("password");

secondButton.hidden = true;
mainButton.hidden = false;

checkbox.addEventListener("change", function () {
  if (this.checked) {
    mainButton.hidden = true;
    secondButton.hidden = false;
    userInput.value = "";
    passInput.value = "";
    toggleText.textContent = "Sign in";
  } else {
    secondButton.hidden = true;
    mainButton.hidden = false;
    userInput.value = "";
    passInput.value = "";
    toggleText.textContent = "Sign up";
  }
});

async function getDataIn() {
  const userInput = document.getElementById("username").value;
  const passInput = document.getElementById("password").value;
  if (!userInput || !passInput) return alert("harap isi semua kolom");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userInput)) {
    return alert("Format email tidak valid!");
  }

  // Validasi harus gmail
  if (!userInput.endsWith("@gmail.com")) {
    return alert("Harus menggunakan email Gmail!");
  }

  try {
    const res = await fetch(
      "https://login-register-production-2f56.up.railway.app/signIn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userInput, password: passInput }),
      },
    );

    const data = await res.json();

    if (data.status) {
      window.location.href = "https://newbiejy235.github.io/HomePage/";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Gagal koneksi:", error);
    alert("Gagal terhubung ke server. Pastikan backend sudah jalan.");
  }
}
