function checkPassword() {
    const pass = document.getElementById("password").value;
    let score = 0;

    // panjang
    if (pass.length >= 8) score++;

    // kombinasi karakter
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[\W_]/.test(pass)) score++;

    // pola umum
    const weakPatterns = ["123456", "password", "qwerty", "111111", "abc123"];
    if (weakPatterns.some(p => pass.toLowerCase().includes(p))) score = 1;

    let text = "";
    if (score <= 2) text = "Weak ❌";
    else if (score <= 4) text = "Medium ⚠️";
    else text = "Strong ✅";

    document.getElementById("result").innerText = text;
}
