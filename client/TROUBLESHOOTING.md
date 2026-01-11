# 🔧 Troubleshooting Guide

## Masalah: Tombol Login Loading Tapi Tidak Ada Reaksi

### 1. Cek Environment Variables

Pastikan file `.env` ada dan environment variables terbaca:

```bash
cd client
cat .env
```

Jika file tidak ada atau kosong:
```bash
cp .env.example .env
# Edit .env dan isi dengan nilai Firebase Anda
```

**PENTING:** Setelah membuat/mengubah `.env`, **RESTART Expo server**:
```bash
# Stop server (Ctrl+C)
npx expo start --clear
```

### 2. Cek Console Logs

Buka terminal tempat Expo berjalan dan cari pesan error:
- `❌ Firebase Config Error` = Environment variables tidak terbaca
- `❌ Login error` = Error dari Firebase Authentication
- `🔐 Attempting login` = Login sedang diproses

### 3. Cek Firebase Console

Pastikan:
- ✅ User sudah dibuat di **Authentication** > **Users**
- ✅ Email/Password Authentication sudah diaktifkan di Firebase Console
- ✅ Realtime Database sudah dibuat

### 4. Cek Koneksi Internet

Pastikan device/emulator terhubung ke internet.

### 5. Cek Firebase Rules

Pastikan Realtime Database rules mengizinkan read/write:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "attendances": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 6. Test dengan Console Logs

Buka Developer Tools di Expo:
- Tekan `j` di terminal Expo untuk buka debugger
- Atau shake device dan pilih "Debug Remote JS"

Lihat console untuk error messages.

## Masalah: Expo CLI Deprecated Warning

Gunakan `npx expo` bukan `expo`:

```bash
# ❌ SALAH
expo start

# ✅ BENAR
npx expo start
```

Atau update package.json scripts sudah menggunakan `expo` langsung (tidak perlu `npx`).

## Masalah: Environment Variables Tidak Terbaca

1. Pastikan file `.env` ada di folder `client/` (root project)
2. Pastikan menggunakan prefix `EXPO_PUBLIC_`
3. Restart Expo server setelah membuat/mengubah `.env`
4. Clear cache: `npx expo start --clear`

## Masalah: Firebase Error Codes

### `auth/user-not-found`
- User belum dibuat di Firebase Authentication
- Solusi: Buat user di Firebase Console > Authentication > Users

### `auth/wrong-password`
- Password salah
- Solusi: Periksa password atau reset di Firebase Console

### `auth/invalid-email`
- Format email tidak valid
- Solusi: Pastikan format email benar (contoh: user@example.com)

### `auth/network-request-failed`
- Koneksi internet bermasalah
- Solusi: Periksa koneksi internet device/emulator

### `Firebase configuration tidak lengkap`
- Environment variables tidak terbaca
- Solusi: Pastikan `.env` ada dan restart Expo server

## Cara Debug

1. **Cek Console Logs:**
   ```bash
   npx expo start
   # Lihat terminal untuk error messages
   ```

2. **Cek Environment Variables:**
   ```bash
   # Di file config/firebase.ts, tambahkan:
   console.log('Firebase Config:', firebaseConfig);
   ```

3. **Test Firebase Connection:**
   - Buka Firebase Console
   - Cek apakah project aktif
   - Cek apakah Realtime Database sudah dibuat

4. **Test Login Manual:**
   - Pastikan user sudah dibuat di Firebase Authentication
   - Test dengan email/password yang benar

## Quick Fix Checklist

- [ ] File `.env` ada di folder `client/`
- [ ] Semua environment variables sudah diisi
- [ ] Expo server sudah di-restart setelah membuat `.env`
- [ ] User sudah dibuat di Firebase Authentication
- [ ] Email/Password Authentication sudah diaktifkan
- [ ] Realtime Database sudah dibuat
- [ ] Koneksi internet aktif
- [ ] Console logs dicek untuk error messages

## Still Having Issues?

1. Clear cache dan restart:
   ```bash
   npx expo start --clear
   ```

2. Hapus node_modules dan reinstall:
   ```bash
   rm -rf node_modules
   npm install
   npx expo start --clear
   ```

3. Cek Firebase Console untuk error logs
4. Pastikan semua setup sesuai dengan dokumentasi di `README-SETUP.md`
