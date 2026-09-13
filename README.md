# Expense Tracker (Tracking pengeluaran)

Website aplikasi pencatat pengeluaran harian. User dapat menambahkan, melihat, mengedit, menghapus, dan memfilter data transaksi berdasarkan kategori


## Fitur

- Menambahkan transaksi dengan keterangan, nominal, kategori, dan tanggal
- Menampilkan jumlah transaksi dan total nominal pengeluaran
- Memfilter transaksi berdasarkan kategori
- Mengedit data transaksi
- Menghapus transaksi dengan konfirmasi.
- Menampilkan grafik pengeluaran dalam satu bar bertumpuk berdasarkan kategori
- Menyimpan data secara otomatis di browser menggunakan `localStorage`
- Menyesuaikan tampilan untuk layar desktop dan perangkat mobile


## Teknologi yang digunakan

- index.html untuk struktur halaman dan form
- style.css untuk tampilan, layout, tabel, dialog, dan responsive design
- app.js yang bekerja sebagai logika, untuk validasi input, pengolahan data, filter, serta operasi tambah, edit, dan hapus
- `localStorage` untuk menyimpan data transaksi di browser


## Cara kerja website

### Saat halaman dibuka

JavaScript mengambil data transaksi dari `localStorage` dengan kunci `user_expenses`. Jika belum ada data, aplikasi menggunakan array kosong.

### Menambah pengeluaran

Fungsi `inspect()` memeriksa apakah keterangan, nominal, kategori, dan tanggal sudah diisi. Tombol Simpan Transaksi hanya aktif jika seluruh input telah diisi.

Fungsi `rupiah()` mengubah angka nominal menjadi format mata uang Rupiah, contohnya `500000` menjadi `Rp 500.000`.

Saat transaksi disimpan, data dibuat sebagai object yang berisi `id`, `title`, `amount`, `category`, dan `date`. Object tersebut ditambahkan ke array transaksi, kemudian disimpan kembali ke `localStorage`.

### Menampilkan dan memfilter pengeluaran

Fungsi `paint()` menampilkan data ke tabel dan menghitung jumlah serta total nominal transaksi yang sedang ditampilkan.

Filter kategori menampilkan semua transaksi atau hanya transaksi dengan kategori tertentu.

### Grafik pengeluaran

Fungsi `tubiao()` menghitung total nominal untuk setiap kategori dan ada chart dalam bentuk bar (grafik). Grafik juga diperbarui sesuai kategori yang sedang dipilih pada filter

### Edit & hapus pengeluaran

Tombol Edit mengisi dialog edit dengan data yang dipilih. Setelah disimpan, data lama diganti dan tampilan diperbarui.
Tombol Hapus menampilkan dialog konfirmasi. Jika dikonfirmasi, transaksi dihapus dari array dan `localStorage`, lalu tabel diperbarui.


## Cara menjalankan

Buka file `index.html` di browser. Tidak perlu ada install sesuatu atau server khusus untuk buka filenya

## Catatan kecil
> - Data hanya tersimpan pada browser dan device yang digunakan.
> - Pengecekan untuk memblokir angka minus pada kolom nominal masih belum diterapkan secara menyeluruh
