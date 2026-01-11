import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { ref, push, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { database } from '@/config/firebase';

export default function DashboardScreen() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [checkingLocation, setCheckingLocation] = useState(false);

  useEffect(() => {
    checkLocationPermission();
    loadTodayAttendance();
  }, []);

  const checkLocationPermission = async () => {
    setCheckingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Izin lokasi diperlukan untuk absensi');
        Alert.alert(
          'Izin Lokasi Diperlukan',
          'Aplikasi membutuhkan akses lokasi untuk mencatat koordinat absensi. Silakan aktifkan di pengaturan.',
          [{ text: 'OK' }]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      setLocationError(null);
    } catch (error) {
      setLocationError('Gagal mendapatkan lokasi');
      console.error('Location error:', error);
    } finally {
      setCheckingLocation(false);
    }
  };

  const loadTodayAttendance = async () => {
    if (!userData?.employeeId) {
      console.log('⚠️ No employeeId, skipping load attendance');
      return;
    }

    try {
      console.log('📥 Loading today attendance for:', userData.employeeId);
      const today = new Date().toISOString().split('T')[0];
      const attendanceRef = ref(database, 'attendances');
      const q = query(
        attendanceRef,
        orderByChild('employeeId'),
        equalTo(userData.employeeId)
      );

      const snapshot = await get(q);
      if (snapshot.exists()) {
        const attendances = snapshot.val();
        const todayKey = Object.keys(attendances).find((key) => {
          const attendance = attendances[key];
          return attendance.date === today;
        });

        if (todayKey) {
          console.log('✅ Found today attendance:', attendances[todayKey]);
          setTodayAttendance(attendances[todayKey]);
        } else {
          console.log('ℹ️ No attendance for today');
          setTodayAttendance(null);
        }
      } else {
        console.log('ℹ️ No attendance records found');
        setTodayAttendance(null);
      }
    } catch (error: any) {
      console.error('❌ Error loading attendance:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  };

  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('Error', 'Lokasi belum didapatkan. Silakan tunggu sebentar.');
      await checkLocationPermission();
      return;
    }

    if (todayAttendance?.checkInTime) {
      Alert.alert('Info', 'Anda sudah melakukan check in hari ini');
      return;
    }

    if (!userData?.employeeId) {
      Alert.alert('Error', 'Employee ID tidak ditemukan. Pastikan data user sudah lengkap di database.');
      console.error('User data:', userData);
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Starting check in...');
      console.log('User Data:', {
        employeeId: userData?.employeeId,
        employeeName: userData?.name,
        userId: userData?.id,
      });
      console.log('Location:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const now = new Date();
      const attendanceData = {
        employeeId: userData.employeeId,
        employeeName: userData.name || '',
        date: now.toISOString().split('T')[0],
        checkInTime: now.toISOString(),
        checkInLatitude: location.coords.latitude,
        checkInLongitude: location.coords.longitude,
        createdAt: now.toISOString(),
      };

      console.log('📤 Sending data to Firebase:', attendanceData);

      const attendanceRef = ref(database, 'attendances');
      const result = await push(attendanceRef, attendanceData);
      
      console.log('✅ Check in successful! Key:', result.key);

      Alert.alert('Berhasil', 'Check in berhasil dicatat');
      await loadTodayAttendance();
    } catch (error: any) {
      console.error('❌ Check in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Gagal melakukan check in';
      if (error.code === 'PERMISSION_DENIED') {
        errorMessage = 'Tidak memiliki izin untuk menulis data. Periksa Firebase Database Rules.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!location) {
      Alert.alert('Error', 'Lokasi belum didapatkan. Silakan tunggu sebentar.');
      await checkLocationPermission();
      return;
    }

    if (!todayAttendance?.checkInTime) {
      Alert.alert('Error', 'Anda belum melakukan check in hari ini');
      return;
    }

    if (todayAttendance?.checkOutTime) {
      Alert.alert('Info', 'Anda sudah melakukan check out hari ini');
      return;
    }

    if (!userData?.employeeId) {
      Alert.alert('Error', 'Employee ID tidak ditemukan. Pastikan data user sudah lengkap di database.');
      console.error('User data:', userData);
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Starting check out...');
      console.log('Employee ID:', userData.employeeId);
      console.log('Today Attendance:', todayAttendance);

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const attendanceRef = ref(database, 'attendances');
      const q = query(
        attendanceRef,
        orderByChild('employeeId'),
        equalTo(userData.employeeId)
      );

      console.log('🔍 Querying database for employeeId:', userData.employeeId);

      const snapshot = await get(q);
      
      if (!snapshot.exists()) {
        console.error('❌ No attendance record found');
        Alert.alert('Error', 'Data absensi tidak ditemukan. Pastikan Anda sudah melakukan check in hari ini.');
        return;
      }

      const attendances = snapshot.val();
      console.log('📊 Found attendances:', Object.keys(attendances).length);
      
      const todayKey = Object.keys(attendances).find((key) => {
        return attendances[key].date === today;
      });

      if (!todayKey) {
        console.error('❌ No attendance for today');
        Alert.alert('Error', 'Data absensi hari ini tidak ditemukan.');
        return;
      }

      console.log('✅ Found today attendance key:', todayKey);
      console.log('📤 Updating with check out data...');

      const updateRef = ref(database, `attendances/${todayKey}`);
      const updateData = {
        ...attendances[todayKey],
        checkOutTime: now.toISOString(),
        checkOutLatitude: location.coords.latitude,
        checkOutLongitude: location.coords.longitude,
        updatedAt: now.toISOString(),
      };

      await set(updateRef, updateData);

      console.log('✅ Check out successful!');

      Alert.alert('Berhasil', 'Check out berhasil dicatat');
      await loadTodayAttendance();
    } catch (error: any) {
      console.error('❌ Check out error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Gagal melakukan check out';
      if (error.code === 'PERMISSION_DENIED') {
        errorMessage = 'Tidak memiliki izin untuk menulis data. Periksa Firebase Database Rules.';
      } else if (error.code === 'index-not-defined') {
        errorMessage = 'Database index belum dibuat. Periksa Firebase Console untuk membuat index pada field employeeId.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (userData?.role === 'hrd') {
    router.replace('/(tabs)/hrd');
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Selamat Datang,</Text>
          <Text style={styles.name}>{userData?.name || 'Karyawan'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>Status Lokasi</Text>
          {checkingLocation ? (
            <ActivityIndicator size="small" color="#4a90e2" />
          ) : location ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                ✓ GPS Aktif
              </Text>
              <Text style={styles.coordinateText}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <View style={styles.locationInfo}>
              <Text style={styles.locationError}>⚠ GPS Tidak Aktif</Text>
              <TouchableOpacity onPress={checkLocationPermission} style={styles.retryButton}>
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {todayAttendance && (
          <View style={styles.attendanceCard}>
            <Text style={styles.cardTitle}>Absensi Hari Ini</Text>
            {todayAttendance.checkInTime && (
              <View style={styles.attendanceItem}>
                <Text style={styles.attendanceLabel}>Check In:</Text>
                <Text style={styles.attendanceTime}>
                  {formatTime(todayAttendance.checkInTime)}
                </Text>
              </View>
            )}
            {todayAttendance.checkOutTime && (
              <View style={styles.attendanceItem}>
                <Text style={styles.attendanceLabel}>Check Out:</Text>
                <Text style={styles.attendanceTime}>
                  {formatTime(todayAttendance.checkOutTime)}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.checkInButton,
              (loading || !location || !!todayAttendance?.checkInTime) && styles.buttonDisabled,
            ]}
            onPress={handleCheckIn}
            disabled={loading || !location || !!todayAttendance?.checkInTime}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Check In</Text>
                <Text style={styles.buttonSubtext}>Masuk Kerja</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.checkOutButton,
              (loading ||
                !location ||
                !todayAttendance?.checkInTime ||
                !!todayAttendance?.checkOutTime) && styles.buttonDisabled,
            ]}
            onPress={handleCheckOut}
            disabled={
              loading ||
              !location ||
              !todayAttendance?.checkInTime ||
              !!todayAttendance?.checkOutTime
            }
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Check Out</Text>
                <Text style={styles.buttonSubtext}>Pulang Kerja</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  attendanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  locationInfo: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 4,
  },
  locationError: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 8,
  },
  coordinateText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  attendanceTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  buttonContainer: {
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkInButton: {
    backgroundColor: '#27ae60',
    shadowColor: '#27ae60',
  },
  checkOutButton: {
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
});
