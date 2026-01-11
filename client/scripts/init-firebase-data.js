/**
 * Script untuk inisialisasi data Firebase
 * Jalankan dengan: node scripts/init-firebase-data.js
 * 
 * Script ini akan membuat user contoh di Firebase Authentication
 * dan data user di Realtime Database
 * 
 * CATATAN: Anda perlu membuat user secara manual di Firebase Console
 * atau menggunakan Firebase Admin SDK untuk membuat user dengan password
 */

const admin = require('firebase-admin');

// Inisialisasi Firebase Admin (perlu service account key)
// Untuk testing, gunakan Firebase Console untuk membuat user:
// 1. Buka Firebase Console > Authentication > Users
// 2. Tambah user baru dengan email dan password
// 3. Setelah user dibuat, jalankan script ini untuk menambahkan data user

// Contoh data user yang perlu dibuat di Firebase Authentication:
const sampleUsers = [
  {
    email: 'karyawan1@example.com',
    password: 'karyawan123',
    name: 'Budi Santoso',
    role: 'employee',
    employeeId: 'EMP001',
  },
  {
    email: 'karyawan2@example.com',
    password: 'karyawan123',
    name: 'Siti Nurhaliza',
    role: 'employee',
    employeeId: 'EMP002',
  },
  {
    email: 'hrd@example.com',
    password: 'hrd123',
    name: 'Admin HRD',
    role: 'hrd',
    employeeId: 'HRD001',
  },
];

console.log('========================================');
console.log('INSTRUKSI SETUP FIREBASE DATA');
console.log('========================================');
console.log('\n1. Buka Firebase Console: https://console.firebase.google.com');
console.log('2. Pilih project: absence-cce8d');
console.log('3. Buka Authentication > Users');
console.log('4. Klik "Add user" dan buat user dengan data berikut:\n');

sampleUsers.forEach((user, index) => {
  console.log(`User ${index + 1}:`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${user.password}`);
  console.log(`  Name: ${user.name}`);
  console.log(`  Role: ${user.role}`);
  console.log(`  Employee ID: ${user.employeeId}`);
  console.log('');
});

console.log('5. Setelah user dibuat, buka Realtime Database');
console.log('6. Tambahkan struktur berikut di root database:\n');
console.log('users/');
console.log('  {userId}/');
console.log('    name: "Nama User"');
console.log('    role: "employee" atau "hrd"');
console.log('    employeeId: "EMP001"');
console.log('\n7. Untuk setiap user yang dibuat, tambahkan data di path:');
console.log('   users/{userId dari Firebase Auth}');
console.log('\nContoh struktur JSON:\n');
console.log(JSON.stringify({
  users: {
    'user-id-1': {
      name: 'Budi Santoso',
      role: 'employee',
      employeeId: 'EMP001',
    },
    'user-id-2': {
      name: 'Siti Nurhaliza',
      role: 'employee',
      employeeId: 'EMP002',
    },
    'user-id-3': {
      name: 'Admin HRD',
      role: 'hrd',
      employeeId: 'HRD001',
    },
  },
}, null, 2));

console.log('\n========================================');
console.log('SETUP SELESAI');
console.log('========================================');
console.log('\nSetelah setup, Anda bisa login dengan:');
console.log('- Email: karyawan1@example.com, Password: karyawan123');
console.log('- Email: hrd@example.com, Password: hrd123');
