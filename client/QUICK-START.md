# 🚀 Quick Start Guide - Aplikasi Absensi Karyawan

## ⚡ Langkah Cepat

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Setup Environment Variables
File `.env` sudah dibuat dengan konfigurasi Firebase. Jika belum ada, copy dari `.env.example`:
```bash
cp .env.example .env
```

**PENTING:** File `.env` berisi informasi rahasia dan **TIDAK** akan di-commit ke Git.

### 2. Setup Firebase di Console

#### A. Buat Realtime Database
1. Buka https://console.firebase.google.com
2. Pilih project: **absence-cce8d**
3. Buka **Realtime Database** (bukan Firestore!)
4. Klik **Create Database**
5. Pilih lokasi: **asia-southeast1** (Singapore)
6. Pilih mode: **Start in test mode** (untuk development)

#### B. Setup Database Rules
Buka **Rules** tab dan paste:

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

#### C. Buat User di Authentication
1. Buka **Authentication** > **Users**
2. Klik **Add user**
3. Buat 2 user:

**User 1 - Employee:**
- Email: `karyawan1@example.com`
- Password: `karyawan123`
- **Catat User UID** (akan muncul setelah user dibuat)

**User 2 - HRD:**
- Email: `hrd@example.com`
- Password: `hrd123`
- **Catat User UID**

#### D. Tambahkan Data User di Database
1. Buka **Realtime Database** > **Data** tab
2. Klik **+** di root
3. Tambahkan struktur:

```
users/
  {UID_USER_1}/
    name: "Budi Santoso"
    role: "employee"
    employeeId: "EMP001"
  
  {UID_USER_2}/
    name: "Admin HRD"
    role: "hrd"
    employeeId: "HRD001"
```

**Cara cepat:** Klik **+** di root, ketik `users`, lalu tambahkan child dengan key = UID user.

### 3. Jalankan Aplikasi

```bash
npm start
```

Kemudian:
- Tekan `a` untuk Android emulator
- Atau scan QR code dengan Expo Go app

### 4. Test Login

**Sebagai Employee:**
- Email: `karyawan1@example.com`
- Password: `karyawan123`

**Sebagai HRD:**
- Email: `hrd@example.com`
- Password: `hrd123`

## 📱 Fitur Aplikasi

### ✅ Employee Dashboard
- Check In dengan GPS
- Check Out dengan GPS
- Lihat absensi hari ini
- Status GPS real-time

### ✅ HRD Dashboard
- Lihat semua absensi karyawan
- Filter berdasarkan tanggal
- Detail lengkap: waktu & koordinat GPS

## 🔧 Troubleshooting

**GPS tidak aktif?**
- Pastikan permission lokasi sudah diberikan
- Android: Settings > Apps > Aplikasi > Permissions > Location

**Error login?**
- Pastikan user sudah dibuat di Firebase Authentication
- Pastikan data user ada di Realtime Database path `users/{uid}`

**Error Firebase connection?**
- Pastikan `google-services.json` ada di folder `client/`
- Pastikan Realtime Database sudah dibuat (bukan Firestore)

## 📁 Struktur File Penting

```
client/
  ├── app/
  │   ├── login.tsx              # Halaman login
  │   ├── (tabs)/
  │   │   ├── index.tsx          # Dashboard Employee
  │   │   └── hrd.tsx            # Dashboard HRD
  │   └── _layout.tsx            # Root layout dengan AuthProvider
  ├── contexts/
  │   └── AuthContext.tsx        # Context untuk authentication
  ├── config/
  │   └── firebase.ts            # Konfigurasi Firebase
  └── google-services.json       # Firebase config file
```

## 🎨 Design Features

- ✅ Custom UI design (tidak pakai template default)
- ✅ Modern card-based layout
- ✅ Color-coded buttons (green for check-in, red for check-out)
- ✅ Real-time GPS status indicator
- ✅ Responsive design

## 📊 Database Structure

```
attendances/
  {autoId}/
    employeeId: string
    employeeName: string
    date: "YYYY-MM-DD"
    checkInTime: ISO timestamp
    checkInLatitude: number
    checkInLongitude: number
    checkOutTime: ISO timestamp (optional)
    checkOutLatitude: number (optional)
    checkOutLongitude: number (optional)
    createdAt: ISO timestamp

users/
  {userId}/
    name: string
    role: "employee" | "hrd"
    employeeId: string
```

## 🚀 Deploy ke Production

1. Build APK:
```bash
eas build --platform android
```

2. Atau build dengan Expo:
```bash
npx expo build:android
```

## 📝 Catatan Penting

- ✅ Minimum Android 10 (API 29)
- ✅ GPS permission wajib
- ✅ Firebase Realtime Database (bukan Firestore)
- ✅ Semua data sensitif sudah di-hardcode di config (untuk development)

Untuk production, pindahkan ke environment variables!
