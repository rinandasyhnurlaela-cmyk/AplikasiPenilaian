// Pertemuan 4 - Struktur Kontrol dalam Aplikasi Visual (versi web)
// Alur: INPUT (input) -> EVENT (submit/click) -> PROSES (if / loop) -> OUTPUT (elemen teks)

// ===== LANGKAH 1: AMBIL ELEMEN DARI HTML =====
const form            = document.getElementById("formPenilaian");
const txtNilai        = document.getElementById("txtNilai");
const txtHadir        = document.getElementById("txtKehadiran");
const btnReset        = document.getElementById("btnReset");
const lblStatus       = document.getElementById("lblStatus");
const lblKategori     = document.getElementById("lblKategori");
const lblBar          = document.getElementById("lblBar");
const progressBarFill = document.getElementById("progressBarFill");
const barPersenText   = document.getElementById("barPersenText");
const lblPesan        = document.getElementById("lblPesan");
const lblRata         = document.getElementById("lblRata");
const lstRiwayat      = document.getElementById("lstRiwayat");
const presetButtons   = document.querySelectorAll(".btn-preset");

// Elemen Tambahan: Widget Jam & Tanggal Realtime
const lblTanggal      = document.getElementById("lblTanggal");
const lblJam          = document.getElementById("lblJam");

// Menyimpan nilai-nilai yang pernah dievaluasi (dipakai perulangan for...of)
const riwayatNilai = [];

// ===== FITUR WIDGET WAKTU & TANGGAL REALTIME =====
function perbaruiWaktu() {
  const sekarang = new Date();

  // Format Tanggal Indonesia (contoh: Sabtu, 24 Okt 2026)
  const opsiTanggal = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  if (lblTanggal) {
    lblTanggal.textContent = sekarang.toLocaleDateString('id-ID', opsiTanggal);
  }

  // Format Jam Digital: HH:mm:ss WIB
  const jam = String(sekarang.getHours()).padStart(2, '0');
  const menit = String(sekarang.getMinutes()).padStart(2, '0');
  const detik = String(sekarang.getSeconds()).padStart(2, '0');
  if (lblJam) {
    lblJam.textContent = `${jam}:${menit}:${detik} WIB`;
  }
}

// Inisialisasi jam langsung dan perbarui setiap 1 detik
perbaruiWaktu();
setInterval(perbaruiWaktu, 1000);

// ===== LANGKAH 2: PASANG EVENT =====
form.addEventListener("submit", function (e) {
  e.preventDefault();          // cegah halaman reload otomatis
  evaluasi();
});

btnReset.addEventListener("click", resetForm);

// Bersihkan status error secara dinamis saat mahasiswa mengetik ulang
txtNilai.addEventListener("input", bersihkanError);
txtHadir.addEventListener("input", bersihkanError);

// Pasang event pada tombol Preset Uji Cepat (mempermudah demonstrasi penilaian)
presetButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    txtNilai.value = btn.dataset.nilai;
    txtHadir.value = btn.dataset.hadir;
    bersihkanError();
    evaluasi();
  });
});

// Shortcut keyboard: tombol Escape untuk mereset form
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    resetForm();
  }
});

// ===== LANGKAH 3: FUNGSI VALIDASI (setara TryParse di C#) =====
// Mengembalikan angka bulat, atau null jika bukan angka bulat yang valid
function coba_parse(teks) {
  const bersih = teks.trim();
  if (!/^-?\d+$/.test(bersih)) return null;   // hanya menerima digit (boleh minus)
  return parseInt(bersih, 10);
}

// ===== LANGKAH 4: FUNGSI UTAMA (EVENT HANDLER) =====
function evaluasi() {
  bersihkanError();

  // ---------- VALIDASI INPUT ----------
  // (a) input kosong
  if (txtNilai.value.trim() === "") {
    return tampilkanError("Nilai akhir ujian tidak boleh kosong.", txtNilai);
  }
  if (txtHadir.value.trim() === "") {
    return tampilkanError("Persentase kehadiran tidak boleh kosong.", txtHadir);
  }

  // (b) bukan angka bulat
  const nilai = coba_parse(txtNilai.value);
  if (nilai === null) {
    return tampilkanError("Nilai akhir harus berupa angka bulat (integer).", txtNilai);
  }
  const kehadiran = coba_parse(txtHadir.value);
  if (kehadiran === null) {
    return tampilkanError("Kehadiran harus berupa angka bulat (integer).", txtHadir);
  }

  // (c) di luar batas rentang 0–100
  if (nilai < 0 || nilai > 100) {
    return tampilkanError("Nilai akhir harus berada di antara rentang 0 s.d. 100.", txtNilai);
  }
  if (kehadiran < 0 || kehadiran > 100) {
    return tampilkanError("Persentase kehadiran harus di antara rentang 0 s.d. 100.", txtHadir);
  }

  // ---------- PERCABANGAN (BRANCHING) ----------
  // Aturan kelulusan akademik: Nilai >= 60 DAN Kehadiran >= 75%
  const lulus = (nilai >= 60) && (kehadiran >= 75);

  // Alasan / Keterangan Analisis (if – else if – else)
  let pesan;
  if (lulus) {
    pesan = "Selamat! Syarat nilai minimal (≥60) dan kehadiran (≥75%) terpenuhi.";
  } else if (nilai < 60 && kehadiran < 75) {
    pesan = "Tidak lulus: Nilai belum mencapai 60 dan kehadiran di bawah 75%.";
  } else if (nilai < 60) {
    pesan = "Tidak lulus: Nilai ujian belum mencapai standar kelulusan (60).";
  } else {
    pesan = "Tidak lulus: Tingkat kehadiran belum memenuhi syarat minimal 75%.";
  }

  // Bonus: Penentuan Kategori Grade A–D (diuji bertingkat dari atas ke bawah)
  let kategori;
  if (nilai >= 85) {
    kategori = "A";
  } else if (nilai >= 70) {
    kategori = "B";
  } else if (nilai >= 60) {
    kategori = "C";
  } else {
    kategori = "D";
  }

  // ---------- PERULANGAN (LOOPING) ----------
  // (a) Looping `for`: membuat bar visual berbasis teks (1 blok = 10 poin)
  let bar = "";
  const totalBlok = Math.floor(nilai / 10);
  for (let i = 1; i <= 10; i++) {
    bar += (i <= totalBlok) ? "█" : "░";
  }

  // (b) Looping `for...of`: menelusuri riwayat untuk menghitung rata-rata kumulatif
  riwayatNilai.push(nilai);
  let total = 0;
  for (const n of riwayatNilai) {
    total += n;
  }
  const rata = total / riwayatNilai.length;

  // ---------- OUTPUT (MEMPERBARUI TAMPILAN UI) ----------
  // 1. Status kelulusan
  lblStatus.textContent = lulus ? "Status: LULUS" : "Status: TIDAK LULUS";
  lblStatus.className = "status " + (lulus ? "lulus" : "gagal");

  // 2. Kategori predikat
  lblKategori.textContent = "Kategori: " + kategori;
  lblKategori.classList.add("aktif");

  // 3. Bar visual ASCII & Progress fill modern
  lblBar.textContent = bar + "  " + nilai + "/100";
  if (progressBarFill) {
    progressBarFill.style.width = nilai + "%";
  }
  if (barPersenText) {
    barPersenText.textContent = nilai + "%";
  }

  // 4. Pesan umpan balik
  lblPesan.textContent = pesan;
  lblPesan.className = "pesan ok";

  // 5. Tambah item ke riwayat dengan card semantic yang rapi
  const item = document.createElement("li");
  item.className = "riwayat-item";
  item.innerHTML = `
    <div class="riwayat-meta">
      <span class="item-badge-no">#${riwayatNilai.length}</span>
      <span class="item-data">Nilai: <strong>${nilai}</strong> | Hadir: <strong>${kehadiran}%</strong> | Grade: <strong>${kategori}</strong></span>
    </div>
    <span class="riwayat-status-tag ${lulus ? 'tag-lulus' : 'tag-gagal'}">
      ${lulus ? '✔ LULUS' : '✖ TIDAK LULUS'}
    </span>
  `;
  lstRiwayat.appendChild(item);
  lstRiwayat.scrollTop = lstRiwayat.scrollHeight;

  // 6. Rata-rata nilai
  lblRata.textContent = "Rata-rata: " + rata.toFixed(1);
}

// ===== LANGKAH 5: FUNGSI PENDUKUNG =====

// Pola aman: validasi -> beri notifikasi error -> hentikan alur -> fokuskan ke input yang salah
function tampilkanError(pesan, target) {
  lblStatus.textContent = "Input Tidak Valid";
  lblStatus.className = "status gagal";
  lblKategori.textContent = "Kategori: -";
  lblKategori.classList.remove("aktif");
  lblBar.textContent = "░░░░░░░░░░  0/100";
  if (progressBarFill) progressBarFill.style.width = "0%";
  if (barPersenText) barPersenText.textContent = "-";
  
  lblPesan.textContent = pesan;
  lblPesan.className = "pesan error";
  
  target.classList.add("salah");
  target.focus();
  target.select();
}

function bersihkanError() {
  txtNilai.classList.remove("salah");
  txtHadir.classList.remove("salah");
}

function resetForm() {
  txtNilai.value = "";
  txtHadir.value = "";
  riwayatNilai.length = 0;
  lstRiwayat.innerHTML = "";
  bersihkanError();

  lblStatus.textContent = "Status: -";
  lblStatus.className = "status";
  lblKategori.textContent = "Kategori: -";
  lblKategori.classList.remove("aktif");
  lblBar.textContent = "░░░░░░░░░░  0/100";
  if (progressBarFill) progressBarFill.style.width = "0%";
  if (barPersenText) barPersenText.textContent = "-";

  lblPesan.textContent = "Isi nilai & kehadiran, lalu tekan EVALUASI.";
  lblPesan.className = "pesan";
  lblRata.textContent = "Rata-rata: -";
  txtNilai.focus();
}
