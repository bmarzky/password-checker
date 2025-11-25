async function checkPassword() {
    const pass = document.getElementById("password").value;

    if (pass.length === 0) {
        document.getElementById("result").innerHTML = "<i>Waiting for input...</i>";
        document.getElementById("progressBar").style.width = "0%";
        return;
    }

    let score = 0;
    let warnings = [];

    // --- Hitung score & warning ---
    if (pass.length >= 12) score += 30;
    else if (pass.length >= 8) score += 20;
    else score += 5;

    const checks = [
        { regex: /[A-Z]/, warn: "Butuh huruf besar" },
        { regex: /[a-z]/, warn: "Butuh huruf kecil" },
        { regex: /[0-9]/, warn: "Butuh angka" },
        { regex: /[\W_]/, warn: "Butuh simbol" }
    ];

    checks.forEach(c => {
        if (!c.regex.test(pass)) warnings.push(c.warn);
        else score += 10;
    });

    // Entropy
    let charset = 0;
    if (/[a-z]/.test(pass)) charset += 26;
    if (/[A-Z]/.test(pass)) charset += 26;
    if (/[0-9]/.test(pass)) charset += 10;
    if (/[\W_]/.test(pass)) charset += 33;
    let entropy = Math.round(pass.length * Math.log2(charset || 1));

    // Rating
    const rating = score < 30 ? "Weak" : score < 60 ? "Medium" : "Strong";

    // Tampilkan sementara status checking
    document.getElementById("result").innerHTML = `
        <b>${rating}</b><br>
        Entropy: ${entropy} bits<br>
        ${warnings.length ? `<ul class="warning-list">${warnings.slice(0,3).map(w=>`<li>${w}</li>`).join("")}${warnings.length>3?`<li>...${warnings.length-3} lebih</li>`:""}</ul>` : ""}
        <small style="color:#888;">Checking leaks...</small>
    `;

    // --- HIBP ---
    const pwned = await checkHIBP(pass);

    // Update hasil akhir tanpa menumpuk teks lama
    let leakText = pwned > 0 
        ? `<br><small style="color:#f77;">Password leak detected! (${pwned} hits)</small>` 
        : `<br><small style="color:#0f0;">No leak detected</small>`;

    document.getElementById("result").innerHTML = `
        <b>${rating}</b><br>
        Entropy: ${entropy} bits<br>
        ${warnings.length ? `<ul class="warning-list">${warnings.slice(0,3).map(w=>`<li>${w}</li>`).join("")}${warnings.length>3?`<li>...${warnings.length-3} lebih</li>`:""}</ul>` : ""}
        ${leakText}
    `;
}



async function checkHIBP(password) {
    const sha1 = await sha1Hash(password);
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5).toUpperCase();

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    for (let line of text.split("\n")) {
        const [hashSuffix, count] = line.split(":");
        if (hashSuffix === suffix) return parseInt(count);
    }
    return 0;
}

async function sha1Hash(str) {
    const buffer = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-1", buffer);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function animateProgressBar(score) {
    const bar = document.getElementById("progressBar");
    let percent;

    // Map score ke persentase bar
    if (score < 30) percent = 25;      // Weak
    else if (score < 60) percent = 60; // Medium
    else percent = 100;                // Strong

    bar.style.width = "0%"; // reset
    setTimeout(() => bar.style.width = percent + "%", 50);
}

