# Password Strength Checker

Proyek sederhana berbasis web untuk mengecek kekuatan password secara real-time.  
Selain menilai tingkat kekuatan password berdasarkan pola karakter, proyek ini juga melakukan pengecekan kebocoran password menggunakan API Have I Been Pwned (HIBP) dengan metode k-Anonymity sehingga password tetap aman.

## Fitur

### 1. Analisis Kekuatan Password (Lokal)
Password dianalisis langsung di browser tanpa dikirim ke server. Kriteria yang digunakan:

- Panjang password
- Adanya huruf besar
- Adanya huruf kecil
- Adanya angka
- Adanya simbol
- Peringatan pola umum (kurangnya jenis karakter tertentu)
- Perhitungan entropy (bit keamanan)

Hasil analisis menghasilkan tiga kategori:
- Weak
- Medium
- Strong

### 2. Pengecekan Kebocoran Password (HIBP API)
Proyek ini menggunakan API Pwned Passwords dari Have I Been Pwned untuk mengecek apakah password pernah muncul dalam kebocoran data publik.

Cara kerja:
1. Password di-hash secara lokal menggunakan SHA-1.
2. Hanya 5 karakter pertama hash yang dikirim ke API (k-Anonymity).
3. API mengembalikan daftar hash suffix + jumlah kebocoran.
4. Pencocokan dilakukan di browser, bukan di server HIBP.
5. Password asli tidak pernah dikirim keluar.

Output:
- Jika ditemukan, ditampilkan jumlah kebocoran.
- Jika aman, ditampilkan status "No leak detected".

### 3. Pembaruan UI Secara Real-Time
- Kekuatan password diperbarui saat pengguna mengetik.
- Progress bar animasi sesuai nilai kekuatan.
- Daftar peringatan karakter yang belum terpenuhi.
- Status pengecekan kebocoran tampil terpisah.

### 4. Teknologi yang Digunakan
- HTML
- CSS
- JavaScript

## Cara Kerja Secara Teknis

1. Pengguna memasukkan password.
2. JavaScript menghitung skor berdasarkan panjang dan kombinasi karakter.
3. Entropy dihitung menggunakan rumus: `length * log2(charset size)`.
4. Password di-hash menggunakan Web Crypto API (SHA-1).
5. Prefix hash (5 karakter pertama) dikirim ke:
   https://api.pwnedpasswords.com/range/<prefix>
6. JavaScript mencocokkan suffix hash dengan hasil dari API.
7. Sistem menampilkan:
   - Strength (Weak/Medium/Strong)
   - Entropy
   - Peringatan karakter
   - Status kebocoran password

## Penulis

**Bima Rizki**  
Mahasiswa Teknik Informatika & Enthusiast Keamanan Siber