# Setup Aplikasi Absensi Karyawan

## Persyaratan
- Node.js 18+
- Expo CLI
- Android Studio (untuk testing di Android)
- Firebase project sudah dibuat

## Instalasi

1. Install dependencies:
```bash
cd client
npm install
```

2. Setup Environment Variables:
   - File `.env` sudah dibuat dengan konfigurasi Firebase
   - Jika belum ada, copy dari `.env.example`: `cp .env.example .env`
   - **PENTING:** File `.env` berisi informasi rahasia dan tidak akan di-commit ke Git
   - Semua konfigurasi Firebase sekarang ada di file `.env`, bukan di source code

3. Setup Firebase:
   - File `google-services.json` sudah ada di root folder `client/`
   - Konfigurasi Firebase ada di `config/firebase.ts`

3. Setup Database di Firebase Console:
   - Buka Firebase Console: https://console.firebase.google.com
   - Pilih project: `absence-cce8d`
   - Buka **Realtime Database** (bukan Firestore)
   - Buat database baru dengan mode **Test Mode** untuk development
   - Atau setup rules berikut untuk production:

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
      ".write": "auth != null",
      "$attendanceId": {
        ".validate": "newData.hasChildren(['employeeId', 'date', 'checkInTime'])"
      }
    }
  }
}
```

4. Setup Authentication:
   - Buka **Authentication** > **Users**
   - Klik **Add user** untuk membuat user baru
   - Buat minimal 2 user:
     - **Employee**: email: `karyawan1@example.com`, password: `karyawan123`
     - **HRD**: email: `hrd@example.com`, password: `hrd123`

5. Setup User Data di Realtime Database:
   - Setelah user dibuat di Authentication, catat **User UID** dari user tersebut
   - Buka **Realtime Database**
   - Tambahkan data di path `users/{userId}`:
   
   Untuk Employee:
   ```json
   {
     "name": "Budi Santoso",
     "role": "employee",
     "employeeId": "EMP001"
   }
   ```
   
   Untuk HRD:
   ```json
   {
     "name": "Admin HRD",
     "role": "hrd",
     "employeeId": "HRD001"
   }
   ```

## Menjalankan Aplikasi

1. Start Expo:
```bash
npm start
```

2. Scan QR code dengan Expo Go app (Android/iOS) atau tekan `a` untuk Android emulator

3. Untuk testing di Android emulator:
   - Pastikan Android emulator sudah running
   - Pastikan Android SDK 29+ (Android 10+) terinstall
   - Jalankan: `npm run android`

## Testing

### Login sebagai Employee:
- Email: `karyawan1@example.com`
- Password: `karyawan123`

### Login sebagai HRD:
- Email: `hrd@example.com`
- Password: `hrd123`

## Fitur Aplikasi

### Employee:
- ✅ Login dengan email/password
- ✅ Check In dengan GPS tracking
- ✅ Check Out dengan GPS tracking
- ✅ Melihat absensi hari ini
- ✅ Status GPS real-time

### HRD:
- ✅ Login dengan email/password
- ✅ Melihat riwayat absensi semua karyawan
- ✅ Filter absensi berdasarkan tanggal
- ✅ Detail lengkap: waktu check in/out, koordinat GPS

## Struktur Database

```
attendances/
  {attendanceId}/
    employeeId: "EMP001"
    employeeName: "Budi Santoso"
    date: "2024-01-15"
    checkInTime: "2024-01-15T08:00:00.000Z"
    checkInLatitude: -6.208763
    checkInLongitude: 106.845599
    checkOutTime: "2024-01-15T17:00:00.000Z"
    checkOutLatitude: -6.208763
    checkOutLongitude: 106.845599
    createdAt: "2024-01-15T08:00:00.000Z"

users/
  {userId}/
    name: "Budi Santoso"
    role: "employee" | "hrd"
    employeeId: "EMP001"
```

## Troubleshooting

### GPS tidak aktif:
- Pastikan permission lokasi sudah diberikan
- Untuk Android: Settings > Apps > Aplikasi Absensi > Permissions > Location > Allow

### Error Firebase:
- Pastikan `google-services.json` ada di folder `client/`
- Pastikan Firebase project ID sesuai
- Pastikan Realtime Database sudah dibuat

### Error login:
- Pastikan user sudah dibuat di Firebase Authentication
- Pastikan data user sudah ditambahkan di Realtime Database path `users/{userId}`
