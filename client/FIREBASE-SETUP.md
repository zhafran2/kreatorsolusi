# 🔥 Firebase Setup untuk Check In/Check Out

## ⚠️ Masalah Umum: Check In/Check Out Tidak Bekerja

Jika tombol check in/check out tidak melakukan apa-apa, kemungkinan masalahnya di Firebase setup.

## ✅ Checklist Firebase Setup

### 1. Realtime Database Rules

Buka Firebase Console > Realtime Database > Rules, pastikan rules seperti ini:

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
      ".indexOn": ["employeeId", "date"]
    }
  }
}
```

**PENTING:** 
- Pastikan `".indexOn": ["employeeId", "date"]` ada untuk performa query
- Pastikan `".write": "auth != null"` untuk mengizinkan write

### 2. Database Index

Untuk query berdasarkan `employeeId`, Firebase perlu index. 

**Cara membuat index:**
1. Buka Firebase Console > Realtime Database
2. Klik tab **Indexes**
3. Klik **Add Index**
4. Collection: `attendances`
5. Fields:
   - Field: `employeeId` → Ascending
   - Field: `date` → Ascending (optional, untuk sorting)
6. Klik **Create**

**ATAU** Firebase akan otomatis membuat index jika rules sudah ada `".indexOn"`.

### 3. User Data di Database

Pastikan data user sudah lengkap di path `users/{uid}`:

```json
{
  "name": "Budi Santoso",
  "role": "employee",
  "employeeId": "EMP001"
}
```

**PENTING:** 
- Field `employeeId` **WAJIB** ada
- Tanpa `employeeId`, check in/check out tidak akan bekerja

### 4. Struktur Database yang Benar

```
Realtime Database
├── users/
│   ├── {uid_employee}/
│   │   ├── name: "Budi Santoso"
│   │   ├── role: "employee"
│   │   └── employeeId: "EMP001"
│   └── {uid_hrd}/
│       ├── name: "Admin HRD"
│       ├── role: "hrd"
│       └── employeeId: "HRD001"
│
└── attendances/
    ├── {autoId1}/
    │   ├── employeeId: "EMP001"
    │   ├── employeeName: "Budi Santoso"
    │   ├── date: "2024-01-15"
    │   ├── checkInTime: "2024-01-15T08:00:00.000Z"
    │   ├── checkInLatitude: -6.208763
    │   ├── checkInLongitude: 106.845599
    │   ├── checkOutTime: "2024-01-15T17:00:00.000Z" (optional)
    │   ├── checkOutLatitude: -6.208763 (optional)
    │   ├── checkOutLongitude: 106.845599 (optional)
    │   └── createdAt: "2024-01-15T08:00:00.000Z"
    └── {autoId2}/
        └── ...
```

## 🔍 Debugging

### Cek Console Logs

Saat check in/check out, buka console di terminal Expo dan cari:

**Check In:**
- `📝 Starting check in...` = Proses dimulai
- `📤 Sending data to Firebase:` = Data yang dikirim
- `✅ Check in successful!` = Berhasil
- `❌ Check in error:` = Ada error

**Check Out:**
- `📝 Starting check out...` = Proses dimulai
- `🔍 Querying database` = Mencari data
- `✅ Found today attendance` = Data ditemukan
- `✅ Check out successful!` = Berhasil
- `❌ Check out error:` = Ada error

### Error Codes yang Umum

**PERMISSION_DENIED**
- **Masalah:** Database rules tidak mengizinkan write
- **Solusi:** Update rules seperti di atas

**index-not-defined**
- **Masalah:** Index belum dibuat untuk query
- **Solusi:** Buat index di Firebase Console atau tambahkan `".indexOn"` di rules

**Data tidak tersimpan**
- **Masalah:** `employeeId` tidak ada di user data
- **Solusi:** Pastikan data user di `users/{uid}` punya field `employeeId`

## 🛠️ Langkah Perbaikan

### Step 1: Cek Database Rules

1. Buka Firebase Console > Realtime Database > Rules
2. Copy-paste rules di atas
3. Klik **Publish**

### Step 2: Cek User Data

1. Buka Realtime Database > Data
2. Cek path `users/{uid}` untuk user yang login
3. Pastikan ada field `employeeId`
4. Jika tidak ada, tambahkan:
   - Klik `users/{uid}`
   - Klik **+** → Key: `employeeId` → Value: `EMP001` (atau sesuai)

### Step 3: Test dengan Console Logs

1. Restart Expo: `npx expo start --clear`
2. Login ke aplikasi
3. Coba check in
4. Lihat console logs di terminal
5. Cek error messages yang muncul

### Step 4: Cek Database

Setelah check in, buka Firebase Console > Realtime Database > Data
- Cek apakah data muncul di `attendances/`
- Jika tidak muncul, lihat error di console logs

## 📝 Quick Fix Checklist

- [ ] Database rules sudah benar (`.write: "auth != null"`)
- [ ] Index sudah dibuat untuk `employeeId`
- [ ] User data punya field `employeeId`
- [ ] Console logs dicek untuk error messages
- [ ] Koneksi internet aktif
- [ ] User sudah login (authenticated)

## 💡 Tips

1. **Gunakan Test Mode** untuk development:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   ⚠️ Hanya untuk testing! Jangan gunakan di production.

2. **Cek di Firebase Console** apakah data tersimpan setelah check in

3. **Gunakan console logs** untuk debugging - semua proses sudah di-log

4. **Restart Expo** setelah mengubah database rules

## 🆘 Masih Tidak Bekerja?

1. Cek console logs untuk error spesifik
2. Cek Firebase Console > Realtime Database > Data apakah data tersimpan
3. Cek Firebase Console > Realtime Database > Rules apakah rules benar
4. Pastikan user sudah login dan punya `employeeId` di database
5. Cek koneksi internet device/emulator
