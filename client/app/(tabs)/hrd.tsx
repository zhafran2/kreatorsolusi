import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '@/config/firebase';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
}

export default function HRDDashboardScreen() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (userData?.role !== 'hrd') {
      router.replace('/(tabs)');
      return;
    }
    loadAttendances();
  }, [selectedDate]);

  const loadAttendances = async () => {
    setLoading(true);
    try {
      const attendanceRef = ref(database, 'attendances');
      const snapshot = await get(attendanceRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const attendanceList: AttendanceRecord[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Filter by selected date and sort by check in time
        const filtered = attendanceList
          .filter((att) => att.date === selectedDate)
          .sort((a, b) => {
            const timeA = a.checkInTime || '';
            const timeB = b.checkInTime || '';
            return timeB.localeCompare(timeA);
          });

        setAttendances(filtered);
      } else {
        setAttendances([]);
      }
    } catch (error) {
      console.error('Error loading attendances:', error);
      Alert.alert('Error', 'Gagal memuat data absensi');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDateOptions = () => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (userData?.role !== 'hrd') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard HRD</Text>
          <Text style={styles.subtitle}>Riwayat Absensi Karyawan</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getDateOptions().map((date) => (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateButton,
                selectedDate === date && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  selectedDate === date && styles.dateButtonTextActive,
                ]}
              >
                {new Date(date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Text style={styles.countText}>
          {attendances.length} Karyawan
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
        </View>
      ) : attendances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Tidak ada data absensi untuk tanggal ini
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {attendances.map((attendance) => (
            <View key={attendance.id} style={styles.attendanceCard}>
              <View style={styles.cardHeader}>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>
                    {attendance.employeeName}
                  </Text>
                  <Text style={styles.employeeId}>
                    ID: {attendance.employeeId}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    attendance.checkOutTime
                      ? styles.statusComplete
                      : styles.statusPartial,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {attendance.checkOutTime ? 'Lengkap' : 'Belum Check Out'}
                  </Text>
                </View>
              </View>

              <View style={styles.attendanceDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check In:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(attendance.checkInTime)}
                  </Text>
                </View>
                {attendance.checkInLatitude && attendance.checkInLongitude && (
                  <Text style={styles.coordinateText}>
                    📍 {attendance.checkInLatitude.toFixed(6)},{' '}
                    {attendance.checkInLongitude.toFixed(6)}
                  </Text>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check Out:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(attendance.checkOutTime)}
                  </Text>
                </View>
                {attendance.checkOutLatitude && attendance.checkOutLongitude && (
                  <Text style={styles.coordinateText}>
                    📍 {attendance.checkOutLatitude.toFixed(6)},{' '}
                    {attendance.checkOutLongitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
  dateSelector: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  dateButtonActive: {
    backgroundColor: '#4a90e2',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  dateButtonTextActive: {
    color: '#fff',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  attendanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusComplete: {
    backgroundColor: '#d4edda',
  },
  statusPartial: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#155724',
  },
  attendanceDetails: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  coordinateText: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    marginTop: 4,
    marginBottom: 8,
  },
});
