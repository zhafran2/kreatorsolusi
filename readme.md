# 📱 Aplikasi Absensi Karyawan - React Native + Firebase

Aplikasi absensi karyawan berbasis Android dengan fitur GPS tracking, built dengan React Native (Expo) dan Firebase.

## ✨ Fitur Utama

### 👤 Employee (Karyawan)
- ✅ Login dengan email/password
- ✅ Check In dengan GPS tracking (latitude & longitude)
- ✅ Check Out dengan GPS tracking
- ✅ Melihat absensi hari ini
- ✅ Status GPS real-time
- ✅ Validasi: tidak bisa check out sebelum check in

### 👔 HRD (Human Resources)
- ✅ Login dengan email/password
- ✅ Dashboard riwayat absensi semua karyawan
- ✅ Filter absensi berdasarkan tanggal (7 hari terakhir)
- ✅ Detail lengkap: waktu check in/out, koordinat GPS
- ✅ Status absensi (Lengkap / Belum Check Out)

## 🛠️ Tech Stack

- **React Native** (Expo ~54.0)
- **Firebase** (Authentication + Realtime Database)
- **Expo Location** (GPS tracking)
- **TypeScript**
- **Expo Router** (File-based routing)

## 📋 Persyaratan

- Node.js 18+
- Android Studio (untuk emulator) atau Android device
- Firebase project (sudah dibuat: `absence-cce8d`)
- Minimum Android 10 (API 29)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Setup Environment Variables
File `.env` sudah dibuat dengan konfigurasi Firebase. Semua informasi rahasia Firebase sekarang disimpan di file `.env` (tidak di source code).

**PENTING:** 
- File `.env` berisi informasi rahasia dan **TIDAK** akan di-commit ke Git
- Jika file `.env` belum ada, copy dari `.env.example` dan isi dengan nilai yang sesuai
- Setelah membuat/mengubah `.env`, restart Expo server (`npm start`)

### 3. Setup Firebase

#### A. Buat Realtime Database
1. Buka https://console.firebase.google.com
2. Pilih project: **absence-cce8d**
3. Buka **Realtime Database** → **Create Database**
4. Lokasi: **asia-southeast1** (Singapore)
5. Mode: **Start in test mode**

#### B. Setup Database Rules
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
Buat 2 user di **Authentication** > **Users**:

**Employee:**
- Email: `karyawan1@example.com`
- Password: `karyawan123`

**HRD:**
- Email: `hrd@example.com`
- Password: `hrd123`

**Catat User UID** dari masing-masing user!

#### D. Tambahkan Data User di Database
Di **Realtime Database**, tambahkan:

```
users/
  {UID_EMPLOYEE}/
    name: "Budi Santoso"
    role: "employee"
    employeeId: "EMP001"
  
  {UID_HRD}/
    name: "Admin HRD"
    role: "hrd"
    employeeId: "HRD001"
```

### 3. Jalankan Aplikasi

```bash
npm start
```

Kemudian tekan `a` untuk Android emulator atau scan QR code dengan Expo Go.

## 📁 Struktur Project

```
client/
├── app/
│   ├── login.tsx              # Halaman login
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard Employee
│   │   └── hrd.tsx            # Dashboard HRD
│   └── _layout.tsx             # Root layout dengan AuthProvider
├── contexts/
│   └── AuthContext.tsx        # Context untuk authentication
├── config/
│   └── firebase.ts            # Konfigurasi Firebase
├── google-services.json       # Firebase config (sudah ada)
├── README-SETUP.md            # Dokumentasi setup lengkap
└── QUICK-START.md             # Quick start guide
```

## 🗄️ Database Structure

### Users
```
users/
  {userId}/
    name: string
    role: "employee" | "hrd"
    employeeId: string
```

### Attendances
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
```

## 🎨 Design Features

- ✅ Custom UI design (tidak pakai template default)
- ✅ Modern card-based layout
- ✅ Color-coded buttons:
  - 🟢 Green untuk Check In
  - 🔴 Red untuk Check Out
- ✅ Real-time GPS status indicator
- ✅ Responsive design
- ✅ Loading states & error handling

## 📱 Screenshots Fitur

### Employee Dashboard
- Status GPS real-time
- Card absensi hari ini
- Tombol Check In (hijau) & Check Out (merah)
- Validasi: tidak bisa check out sebelum check in

### HRD Dashboard
- Filter tanggal (7 hari terakhir)
- List semua karyawan yang absen
- Detail: waktu & koordinat GPS
- Badge status (Lengkap / Belum Check Out)

## 🔧 Troubleshooting

### GPS tidak aktif
- Pastikan permission lokasi sudah diberikan
- Android: Settings > Apps > Aplikasi > Permissions > Location

### Error login
- Pastikan user sudah dibuat di Firebase Authentication
- Pastikan data user ada di Realtime Database path `users/{uid}`

### Error Firebase connection
- Pastikan `google-services.json` ada di folder `client/`
- Pastikan Realtime Database sudah dibuat (bukan Firestore)
- Pastikan package name di app.json sesuai: `com.koleksi.absence`

## 📝 Catatan Penting

1. **Firebase Config**: File `google-services.json` sudah ada dan dikonfigurasi
2. **Environment Variables**: Untuk development, config sudah di-hardcode di `config/firebase.ts`
3. **GPS Permission**: Aplikasi akan meminta permission lokasi saat pertama kali digunakan
4. **Minimum Android**: API 29 (Android 10) - sudah dikonfigurasi di `app.json`

## 🚀 Build untuk Production

### Build APK
```bash
eas build --platform android
```

Atau:
```bash
npx expo build:android
```

## 📧 Kontak

Untuk pertanyaan atau support, hubungi: recrutmentksiemp@gmail.com

## 📄 License

Private project - Kreator Solusi

---

**Status**: ✅ Siap digunakan untuk testing di localhost
**Next Steps**: Setup Firebase database & users sesuai instruksi di atas
