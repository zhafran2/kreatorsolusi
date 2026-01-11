# 🚀 Cara Menjalankan Aplikasi

## ⚠️ PENTING: Gunakan npx expo, BUKAN expo langsung!

Expo CLI global sudah deprecated. Gunakan `npx expo` untuk menjalankan aplikasi.

## Langkah-langkah

### 1. Pastikan Environment Variables Sudah Setup

```bash
cd client
cat .env
```

Jika file tidak ada atau kosong:
```bash
cp .env.example .env
# Edit .env dan isi dengan nilai Firebase Anda
```

### 2. Install Dependencies (jika belum)

```bash
npm install
```

### 3. Jalankan Aplikasi

**Cara yang BENAR:**
```bash
npx expo start
```

**Atau dengan clear cache:**
```bash
npx expo start --clear
```

**JANGAN gunakan:**
```bash
expo start  # ❌ SALAH - akan muncul warning deprecated
```

### 4. Pilih Platform

Setelah Expo server berjalan, pilih:

- **Android Emulator:** Tekan `a`
- **iOS Simulator:** Tekan `i` (hanya di Mac)
- **Web Browser:** Tekan `w`
- **Expo Go App:** Scan QR code dengan aplikasi Expo Go di smartphone

### 5. Untuk Testing di HP Android

1. Install **Expo Go** dari Play Store
2. Pastikan HP dan komputer dalam WiFi yang sama
3. Scan QR code yang muncul di terminal
4. Aplikasi akan terbuka di Expo Go

## Troubleshooting

### Warning: "The global expo-cli package has been deprecated"

**Solusi:** Gunakan `npx expo start` bukan `expo start`

### Environment Variables Tidak Terbaca

1. Pastikan file `.env` ada di folder `client/`
2. Restart Expo server setelah membuat/mengubah `.env`:
   ```bash
   # Stop server (Ctrl+C)
   npx expo start --clear
   ```

### Aplikasi Tidak Terbuka di HP

1. Pastikan HP dan komputer dalam WiFi yang sama
2. Coba gunakan tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
3. Atau gunakan LAN mode:
   ```bash
   npx expo start --lan
   ```

### Error saat Login

Lihat file `TROUBLESHOOTING.md` untuk panduan lengkap.

## Quick Commands

```bash
# Start dengan clear cache
npx expo start --clear

# Start untuk Android langsung
npx expo start --android

# Start untuk web
npx expo start --web

# Build untuk production
npx expo build:android
```

## Tips

- **Clear cache** jika ada masalah: `npx expo start --clear`
- **Restart server** setelah mengubah `.env`
- **Cek console logs** di terminal untuk error messages
- Gunakan **Expo Go** untuk testing cepat di HP
