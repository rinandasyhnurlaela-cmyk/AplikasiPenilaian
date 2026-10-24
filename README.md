# Academic Evaluation Engine
### Sistem Diagnostik & Evaluasi Capaian Akademik Mahasiswa
> **Modul Praktikum Algoritma & Pemrograman: Struktur Kontrol dalam Aplikasi Visual (Versi Web)**  
> **Tema Desain:** *Dark Minimalist Tactical (Hijau Army & Slate Grey)*

---

## 📌 Ringkasan Proyek

**Academic Evaluation Engine** adalah aplikasi web visual interaktif yang dibangun untuk memodelkan implementasi **Struktur Kontrol Pemrograman** (*Input &rarr; Event &rarr; Proses Logika &rarr; Output Visual*). 

Aplikasi ini mengevaluasi kelulusan mahasiswa berdasarkan dua parameter multikriteria utama, yaitu **Nilai Akhir Ujian (0–100)** dan **Tingkat Presensi Perkuliahan (0–100%)**, serta menyajikan hasilnya dalam bentuk **Grafik Distribusi Landscape**, visualisasi desil berbasis perulangan, dan log rekapitulasi nilai kumulatif.

---

## 🌟 Fitur Utama

1. **Dashboard Berorientasi Landscape (2 Kolom):**
   - **Kolom Kiri:** Instrumen formulir penilaian, simulasi kasus uji cepat (*preset*), dan rubrik kualifikasi akademik.
   - **Kolom Kanan:** Kartu status kelulusan, grafik batang horizontal (*landscape*) dengan penanda ambang kelulusan 60%, analisis rekomendasi akademik, dan riwayat rekapitulasi.
2. **Widget Jam & Kalender Digital Realtime:**
   - Menampilkan hari, tanggal, bulan, tahun, serta waktu jam digital (`HH:mm:ss WIB`) yang berdetak secara langsung setiap detik.
3. **Simulasi Kasus Uji Cepat (*Preset Test Cases*):**
   - Tombol sekali klik untuk menguji berbagai skenario kelulusan (*Sangat Memuaskan, Memuaskan, Cukup, Defisit Nilai, Defisit Presensi*) tanpa mengetik manual.
4. **Grafik Capaian Kompetensi Horizontal (Landscape):**
   - Dilengkapi garis penanda ambang batas kelulusan minimal (*Benchmark Line 60%*).
   - Skala sumbu horizontal ($0$, $20$, $40$, $60$, $80$, $100$).
   - Monitor teks desil ASCII (`█` dan `░`) hasil algoritma perulangan `for`.
5. **Estetika Elegan & Modern:**
   - Palet warna eksklusif **Hijau Army (Olive/Sage Green)** dan **Slate Grey (Charcoal)** dengan kontras tinggi.
   - Tipografi modern Google Fonts (*Plus Jakarta Sans* untuk antarmuka dan *JetBrains Mono* untuk data angka/kode).

---

## 📐 Arsitektur & Struktur Kontrol (Materi Dosen)

Kode JavaScript pada berkas `script.js` disusun secara sistematis mengikuti 5 langkah pembelajaran terstruktur:

### 1. Langkah 1: Pengambilan Elemen DOM
Mengikat elemen antarmuka dari HTML ke variabel JavaScript menggunakan `document.getElementById()` dan `document.querySelectorAll()`.

### 2. Langkah 2: Pemasangan Event Listener
- `formPenilaian.addEventListener("submit", ...)`: Menangkap pengiriman form dan mencegah muat ulang halaman (`e.preventDefault()`).
- `btnReset.addEventListener("click", ...)`: Mereset seluruh formulir dan riwayat.
- `input` event: Membersihkan indikator kesalahan (*error styling*) secara otomatis saat pengguna mulai mengetik ulang.
- Tombol Preset: Mengisi nilai otomatis dan langsung memicu evaluasi.
- Shortcut Keyboard: Tombol `Escape` untuk mereset antarmuka secara instan.

### 3. Langkah 3: Fungsi Validasi (`coba_parse`)
Setara dengan metode `int.TryParse` pada bahasa C# atau Java:
```javascript
function coba_parse(teks) {
  const bersih = teks.trim();
  if (!/^-?\d+$/.test(bersih)) return null; // Memastikan hanya digit angka bulat
  return parseInt(bersih, 10);
}
```

### 4. Langkah 4: Fungsi Utama (`evaluasi()`)
- **Validasi Berlapis:**
  1. Memeriksa apakah input kosong.
  2. Memeriksa apakah input berupa bilangan bulat valid.
  3. Memeriksa apakah angka berada dalam rentang valid $0 \le x \le 100$.
- **Percabangan (`if` – `else if` – `else`):**
  - **Syarat Kelulusan:** Mahasiswa dinyatakan **LULUS** jika `nilai >= 60 && kehadiran >= 75`.
  - **Analisis Kualitatif:** Memberikan penjelasan spesifik apakah mahasiswa gagal karena nilai, presensi, atau keduanya.
  - **Penentuan Predikat (Grade):**
    - $\ge 85$: **Grade A** (Sangat Memuaskan)
    - $\ge 70$: **Grade B** (Memuaskan)
    - $\ge 60$: **Grade C** (Cukup)
    - $< 60$: **Grade D** (Tidak Lulus / Kurang)
- **Perulangan (*Looping*):**
  - **Looping `for`:** Membangun bar visual berbasis karakter desil (1 blok = 10 poin):
    ```javascript
    let bar = "";
    const totalBlok = Math.floor(nilai / 10);
    for (let i = 1; i <= 10; i++) {
      bar += (i <= totalBlok) ? "█" : "░";
    }
    ```
  - **Looping `for...of`:** Menghitung total nilai dan rata-rata kumulatif dari seluruh riwayat evaluasi yang tersimpan dalam array `riwayatNilai`:
    ```javascript
    riwayatNilai.push(nilai);
    let total = 0;
    for (const n of riwayatNilai) {
      total += n;
    }
    const rata = total / riwayatNilai.length;
    ```
- **Pembaruan Output Visual (DOM Manipulation):**
  - Mengubah teks status dan kelas CSS (`lulus` / `gagal`).
  - Menyesuaikan lebar grafik batang horizontal (`progressBarFill.style.width`).
  - Menambahkan baris kartu riwayat dengan nomor urut, nilai, kehadiran, grade, dan badge kelulusan.

### 5. Langkah 5: Fungsi Pendukung
- `tampilkanError(pesan, target)`: Mengatur status gagal, menampilkan pesan kesalahan, memberi border merah bergetar (*shake animation*), dan memfokuskan kembali kursor ke input yang salah.
- `bersihkanError()`: Menghilangkan kelas penanda kesalahan dari input.
- `resetForm()`: Mengosongkan data formulir, array riwayat, bar visual, dan mengembalikan status ke kondisi awal.

---

## 📂 Struktur Berkas

```text
PenilaianWeb/
├── index.html     # Struktur semantik HTML5, meta tag, layout grid landscape, & SVG icon
├── style.css      # Desain tema Hijau Army & Slate Grey, responsive grid, & visualisasi grafik
├── script.js      # Implementasi algoritma struktur kontrol (Langkah 1 s.d. 5) & widget jam
└── README.md      # Dokumentasi lengkap proyek dan panduan pengujian akademik
```

---

## 🚀 Panduan Menjalankan Aplikasi

1. **Menggunakan Web Server Lokal:**
   Jalankan perintah HTTP server (misalnya Python atau Node.js) di direktori proyek:
   ```bash
   python -m http.server 8080
   ```
   Buka peramban (browser) dan akses: **`http://localhost:8080`**

2. **Membuka Berkas Secara Langsung:**
   Klik dua kali pada berkas `index.html` untuk langsung membukanya di browser favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, dsb.).

---

## 🧪 Tabel Kasus Uji (*Test Case Matrix*)

| Skenario Uji | Nilai Ujian | Presensi | Hasil Diharapkan | Keterangan Percabangan |
| :--- | :---: | :---: | :---: | :--- |
| **Kasus 1** | `92` | `90%` | **LULUS (Grade A)** | Nilai $\ge 60$ dan Kehadiran $\ge 75$ |
| **Kasus 2** | `74` | `85%` | **LULUS (Grade B)** | Nilai $\ge 60$ dan Kehadiran $\ge 75$ |
| **Kasus 3** | `62` | `80%` | **LULUS (Grade C)** | Nilai $\ge 60$ dan Kehadiran $\ge 75$ |
| **Kasus 4** | `50` | `90%` | **TIDAK LULUS (Grade D)** | Nilai $< 60$ (Meskipun hadir cukup) |
| **Kasus 5** | `85` | `65%` | **TIDAK LULUS (Grade B)** | Kehadiran $< 75\%$ (Meskipun nilai tinggi) |
| **Kasus 6** | `45` | `60%` | **TIDAK LULUS (Grade D)** | Nilai $< 60$ dan Kehadiran $< 75\%$ |
| **Kasus 7** | *Kosong* | `80%` | **Error Validasi** | *"Nilai akhir ujian tidak boleh kosong."* |
| **Kasus 8** | `120` | `80%` | **Error Validasi** | *"Nilai akhir harus berada di antara rentang 0 s.d. 100."* |
| **Kasus 9** | `abc` | `80%` | **Error Validasi** | *"Nilai akhir harus berupa angka bulat (integer)."* |
