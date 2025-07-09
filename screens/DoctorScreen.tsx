import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';

// Doctor data for each disease
const diseaseDoctors = {
  'Heart Disease': [
    { name: 'Dr. Anjali Mehta', specialty: 'Cardiologist' },
    { name: 'Dr. Rakesh Sharma', specialty: 'Cardiac Surgeon' },
  ],
  'Diabetes': [
    { name: 'Dr. Priya Verma', specialty: 'Diabetologist' },
    { name: 'Dr. Sameer Gupta', specialty: 'Endocrinologist' },
  ],
  'Common': [
    { name: 'Dr. Rakesh Sharma', specialty: 'General Physician' },
    { name: 'Dr. Sunita Rao', specialty: 'Family Physician' },
  ],
  'Liver': [
    { name: 'Dr. Kavita Joshi', specialty: 'Hepatologist' },
    { name: 'Dr. Manish Sinha', specialty: 'Gastroenterologist' },
  ],
  'Lung': [
    { name: 'Dr. Suresh Patil', specialty: 'Pulmonologist' },
    { name: 'Dr. Neha Jain', specialty: 'Respiratory Specialist' },
  ],
  'Parkinson': [
    { name: 'Dr. Rajeev Nair', specialty: 'Neurologist' },
    { name: 'Dr. Ananya Das', specialty: 'Movement Disorder Specialist' },
  ],
};

const diseases = Object.keys(diseaseDoctors);

const availableSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:30 PM',
  '04:00 PM', '05:30 PM', '06:00 PM',
];

export default function DoctorScreen() {
  const [selectedDisease, setSelectedDisease] = useState(diseases[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(diseaseDoctors[diseases[0]][0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const formatDate = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot || !selectedDisease) {
      Alert.alert('⚠️ Incomplete', 'Please select disease, doctor, date, and slot.');
    } else {
      Alert.alert(
        '✅ Appointment Confirmed',
        `You have booked with ${selectedDoctor.name} (${selectedDoctor.specialty}) for ${selectedDisease} on ${formatDate(new Date(selectedDate))} at ${selectedSlot}`
      );
    }
  };

  // Update doctors when disease changes
  const onDiseaseSelect = (disease) => {
    setSelectedDisease(disease);
    setSelectedDoctor(diseaseDoctors[disease][0]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Book Appointment</Text>

        <Text style={styles.sectionTitle}>🧬 Select Disease</Text>
        <View style={styles.chipGroup}>
          {diseases.map((d, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedDisease === d && styles.selectedChip,
              ]}
              onPress={() => onDiseaseSelect(d)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedDisease === d && styles.selectedChipText,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>👨‍⚕️ Select Doctor</Text>
        <View style={styles.doctorList}>
          {diseaseDoctors[selectedDisease].map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.doctorCard,
                selectedDoctor?.name === doc.name && styles.selectedDoctor,
              ]}
              onPress={() => setSelectedDoctor(doc)}
              activeOpacity={0.85}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {doc.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{doc.name}</Text>
                <Text style={styles.specialty}>{doc.specialty}</Text>
              </View>
              {selectedDoctor?.name === doc.name && (
                <Text style={styles.selectedTick}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>📅 Select Date</Text>
        <FlatList
          horizontal
          data={dates}
          keyExtractor={(item) => item.toDateString()}
          contentContainerStyle={styles.dateList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateButton,
                selectedDate === item.toDateString() && styles.selectedDate,
              ]}
              onPress={() => setSelectedDate(item.toDateString())}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === item.toDateString() && styles.selectedDateText,
                ]}
              >
                {formatDate(item)}
              </Text>
              <Text style={styles.dayText}>
                {item.toLocaleDateString(undefined, { weekday: 'short' })}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.sectionTitle}>🕒 Available Slots</Text>
        <View style={styles.slotGrid}>
          {availableSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.slot,
                selectedSlot === slot && styles.selectedSlot,
              ]}
              onPress={() => setSelectedSlot(slot)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlot === slot && styles.selectedSlotText,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.bookButton} onPress={handleConfirm} activeOpacity={0.88}>
        <Text style={styles.bookButtonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 22,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 22,
    marginBottom: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 5,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E7EF',
  },
  chipText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  selectedChip: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedChipText: {
    color: '#FFF',
  },
  doctorList: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 2,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    marginBottom: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  selectedDoctor: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.07,
    elevation: 4,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#6366F1',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  specialty: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 1,
  },
  selectedTick: {
    marginLeft: 12,
    fontSize: 20,
    color: '#10B981',
    fontWeight: 'bold',
  },
  dateList: {
    paddingBottom: 10,
    marginTop: 2,
  },
  dateButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 60,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
  },
  dayText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  selectedDate: {
    backgroundColor: '#6366F1',
  },
  selectedDateText: {
    color: '#FFF',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
    marginTop: 8,
  },
  slot: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  selectedSlot: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
    elevation: 2,
  },
  selectedSlotText: {
    color: '#FFF',
  },
  bookButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: Platform.OS === 'ios' ? 30 : 18,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    marginBottom:60,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
