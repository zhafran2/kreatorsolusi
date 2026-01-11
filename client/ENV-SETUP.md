# 🔐 Environment Variables Setup

## Overview

Semua konfigurasi Firebase yang bersifat rahasia sekarang disimpan di file `.env`, bukan di source code. Ini lebih aman dan memudahkan deployment ke environment yang berbeda.

## File Environment

### `.env` (File Aktif)
File ini berisi konfigurasi Firebase yang sebenarnya. **File ini TIDAK akan di-commit ke Git** (sudah ada di `.gitignore`).

### `.env.example` (Template)
File template yang bisa di-commit ke Git. Berisi struktur environment variables tanpa nilai rahasia.

## Setup

1. **File `.env` sudah dibuat** dengan konfigurasi Firebase project Anda
2. Jika file `.env` belum ada, copy dari template:
   ```bash
   cp .env.example .env
   ```
3. Edit file `.env` dan isi dengan nilai yang sesuai dari Firebase Console

## Environment Variables

File `.env` berisi variabel berikut:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Cara Mendapatkan Nilai

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Anda
3. Buka **Project Settings** (ikon gear)
4. Scroll ke bagian **Your apps**
5. Klik ikon web atau Android untuk melihat konfigurasi
6. Copy nilai yang sesuai ke file `.env`

## Penting!

- ✅ **JANGAN** commit file `.env` ke Git
- ✅ **JANGAN** share file `.env` ke public
- ✅ **JANGAN** hardcode nilai rahasia di source code
- ✅ Gunakan `.env.example` sebagai template untuk tim
- ✅ Setelah mengubah `.env`, **restart Expo server** (`npm start`)

## Troubleshooting

### Error: "Firebase configuration tidak lengkap"
- Pastikan file `.env` ada di folder `client/`
- Pastikan semua variabel sudah diisi dengan nilai yang benar
- Restart Expo server setelah membuat/mengubah `.env`

### Environment variables tidak terbaca
- Pastikan menggunakan prefix `EXPO_PUBLIC_` (Expo requirement)
- Restart Expo server: tekan `r` di terminal atau `npm start` ulang
- Pastikan file `.env` ada di root folder `client/`, bukan di folder lain

## Expo Environment Variables

Expo secara otomatis membaca environment variables dengan prefix `EXPO_PUBLIC_` dari file `.env`. Tidak perlu install package tambahan seperti `dotenv`.

Untuk informasi lebih lanjut: https://docs.expo.dev/guides/environment-variables/
