import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Linking,
  Image,
  Platform,
  Alert,
} from 'react-native';

// Responsive scaling
const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 667) * size;

// Doctor data
const doctorSpecialists = {
  Common: [
    { name: 'Dr. Sarah Johnson', specialization: 'Internal Medicine', phone: '+1-555-0123', address: '123 Medical Plaza, New York, NY', rating: 4.9, experience: '15 years', avatar: require('../assets/doctor.png') },
    { name: 'Dr. Michael Chen', specialization: 'Family Medicine', phone: '+1-555-0124', address: '456 Health Center, New York, NY', rating: 4.8, experience: '12 years', avatar: require('../assets/doctor.png') }
  ],
  Heart: [
    { name: 'Dr. Robert Williams', specialization: 'Cardiologist', phone: '+1-555-0125', address: '789 Heart Institute, New York, NY', rating: 4.9, experience: '20 years', avatar: require('../assets/doctor.png') },
    { name: 'Dr. Emily Davis', specialization: 'Cardiovascular Surgeon', phone: '+1-555-0126', address: '321 Cardiac Center, New York, NY', rating: 4.7, experience: '18 years', avatar: require('../assets/doctor.png') }
  ],
  Diabetes: [
    { name: 'Dr. Lisa Martinez', specialization: 'Endocrinologist', phone: '+1-555-0127', address: '654 Diabetes Clinic, New York, NY', rating: 4.8, experience: '16 years', avatar: require('../assets/doctor.png') },
    { name: 'Dr. James Wilson', specialization: 'Diabetologist', phone: '+1-555-0128', address: '987 Metabolic Center, New York, NY', rating: 4.9, experience: '14 years', avatar: require('../assets/doctor.png') }
  ],
  Parkinsons: [
    { name: 'Dr. Amanda Taylor', specialization: 'Neurologist', phone: '+1-555-0129', address: '147 Neurology Institute, New York, NY', rating: 4.9, experience: '22 years', avatar: require('../assets/doctor.png') },
    { name: 'Dr. David Brown', specialization: 'Movement Disorder Specialist', phone: '+1-555-0130', address: '258 Brain Health Center, New York, NY', rating: 4.8, experience: '19 years', avatar: require('../assets/doctor.png') }
  ],
  Liver: [
    { name: 'Dr. Jennifer Garcia', specialization: 'Hepatologist', phone: '+1-555-0131', address: '369 Liver Clinic, New York, NY', rating: 4.7, experience: '17 years', avatar: require('../assets/doctor.png') },
    { name: 'Dr. Kevin Lee', specialization: 'Gastroenterologist', phone: '+1-555-0132', address: '741 Digestive Health Center, New York, NY', rating: 4.8, experience: '15 years', avatar: require('../assets/doctor.png') }
  ],
  Lung: [
    { name: 'Dr. Maria Rodriguez', specialization: 'Pulmonologist', phone: '+1-555-0133', address: '852 Respiratory Center, New York, NY', rating: 4.9, experience: '21 years', avatar: require('../assets/doctor.png') },
    { name: 'Dr. Thomas Anderson', specialization: 'Thoracic Surgeon', phone: '+1-555-0134', address: '963 Lung Institute, New York, NY', rating: 4.8, experience: '18 years', avatar: require('../assets/doctor.png') }
  ],
};

const defaultRecommendedDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'Internal Medicine',
    phone: '+1-555-0123',
    address: '123 Medical Plaza, Suite 401, New York, NY 10001',
    rating: 4.9,
    experience: '15 years',
    avatar: require('../assets/doctor.png'),
  },
  {
    name: 'Dr. Michael Chen',
    specialization: 'Family Medicine',
    phone: '+1-555-0124',
    address: '456 Health Center, Floor 2, New York, NY 10002',
    rating: 4.8,
    experience: '12 years',
    avatar: require('../assets/doctor.png'),
  },
  {
    name: 'Dr. Robert Williams',
    specialization: 'Cardiologist',
    phone: '+1-555-0125',
    address: '789 Heart Institute, Suite 305, New York, NY 10003',
    rating: 4.9,
    experience: '20 years',
    avatar: require('../assets/doctor.png'),
  },
];

export default function ResultScreen({ route, navigation }) {
  const { result, diseaseName = 'Prediction Result', color = '#4facfe', diseaseType } = route.params || {};
  const [showDoctors, setShowDoctors] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(verticalScale(50)))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const doctorSlideAnim = useState(new Animated.Value(-verticalScale(500)))[0];

  const scrollViewRef = useRef(null);

  const doctors = doctorSpecialists[diseaseType] || defaultRecommendedDoctors;

  // Themed card color and icon
  const cardColor = result?.prediction === 'Healthy' ? '#e0f7e9' : '#fff7e6';
  const borderColor = result?.prediction === 'Healthy' ? '#34d399' : '#f59e42';
  const iconSource = result?.prediction === 'Healthy'
    ? require('../assets/healthy.png')
    : require('../assets/warning.png');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(color);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    if (showDoctors) {
      Animated.timing(doctorSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
    } else {
      Animated.timing(doctorSlideAnim, {
        toValue: -verticalScale(500),
        duration: 400,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#f8fafc');
    };
  }, [showDoctors, color]);

  const handleCallDoctor = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleBookAppointment = (doctor) => {
    Alert.alert(
      'Book Appointment',
      `Would you like to book an appointment with ${doctor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => handleCallDoctor(doctor.phone) },
        {
          text: 'Book Online',
          onPress: () => {
            Alert.alert('Booking Confirmed', `Appointment request sent to ${doctor.name}. They will contact you shortly.`);
          },
        },
      ]
    );
  };

  const renderDoctorCard = (doctor, index) => (
    <Animated.View
      key={index}
      style={[
        styles.doctorCard,
        { transform: [{ scale: scaleAnim }], marginRight: scale(14) }
      ]}
    >
      <View style={styles.doctorHeader}>
        <Image
          source={doctor.avatar}
          style={styles.doctorAvatar}
          defaultSource={require('../assets/default-doctor.png')}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          <View style={styles.doctorRating}>
            <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
            <Text style={styles.experienceText}>{doctor.experience} exp</Text>
          </View>
        </View>
      </View>
      <View style={styles.doctorContact}>
        <Text style={styles.contactLabel}>📞 Phone:</Text>
        <Text style={styles.contactValue}>{doctor.phone}</Text>
      </View>
      <View style={styles.doctorContact}>
        <Text style={styles.contactLabel}>📍 Address:</Text>
        <Text style={styles.contactValue}>{doctor.address}</Text>
      </View>
      <View style={styles.doctorActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b981' }]}
          onPress={() => handleCallDoctor(doctor.phone)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: color }]}
          onPress={() => handleBookAppointment(doctor)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>📅 Book</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#f8fafc' }]}>
      <StatusBar barStyle="light-content" backgroundColor={color} />
      <View style={[styles.header, { backgroundColor: color }]}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{diseaseName}</Text>
            <Text style={styles.headerSubtitle}>AI-based Health Insights</Text>
          </View>
        </Animated.View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: cardColor,
              borderColor: borderColor,
              borderWidth: 2,
              shadowColor: borderColor,
              shadowOpacity: 0.15,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View style={{ alignItems: 'center', marginBottom: verticalScale(10), opacity: fadeAnim }}>
            <Image
              source={iconSource}
              style={{ width: scale(60), height: scale(60) }}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.resultLabel}>🧬 Prediction</Text>
          <Text style={styles.resultValue}>
            {result?.prediction || 'No prediction available'}
          </Text>
          {result?.confidence && (
            <View style={{ marginVertical: verticalScale(12) }}>
              <Text style={{ fontWeight: '600', color: '#334155' }}>
                Confidence: {Math.round(result.confidence * 100)}%
              </Text>
              <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginTop: 4 }}>
                <Animated.View style={{
                  width: `${Math.round(result.confidence * 100)}%`,
                  height: 8,
                  backgroundColor: '#34d399',
                  borderRadius: 4,
                }} />
              </View>
            </View>
          )}
          {result?.symptoms && (
            <>
              <Text style={styles.resultLabel}>📝 Symptoms You Entered</Text>
              <Text style={styles.symptomsText}>{result.symptoms}</Text>
            </>
          )}
          {result && Object.keys(result).length > 1 && (
            <View style={styles.rawResultContainer}>
              <Text style={styles.resultLabel}>📊 Raw Data</Text>
              {Object.entries(result).map(([key, value]) => {
                if (key !== 'prediction' && key !== 'symptoms' && key !== 'confidence') {
                  return (
                    <Text key={key} style={styles.rawDataText}>
                      <Text style={styles.rawDataKey}>{key}:</Text> {JSON.stringify(value)}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          )}
        </Animated.View>

        {doctors.length > 0 && (
          <Animated.View style={[
            styles.doctorToggleContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            <TouchableOpacity
              onPress={() => setShowDoctors(prev => !prev)}
              style={[styles.doctorToggleButton, { backgroundColor: color }]}
              activeOpacity={0.8}
            >
              <Text style={styles.doctorToggleIcon}>👨‍⚕️</Text>
              <Text style={styles.doctorToggleText}>
                {showDoctors ? 'Hide' : 'View'} Recommended Specialists
              </Text>
              <Text style={styles.doctorToggleArrow}>{showDoctors ? '↑' : '↓'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {doctors.length > 0 && (
          <Animated.View
            style={[
              styles.doctorsSection,
              {
                opacity: doctorSlideAnim.interpolate({
                  inputRange: [-verticalScale(500), 0],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                }),
                transform: [{ translateY: doctorSlideAnim }],
                position: showDoctors ? 'relative' : 'absolute',
                top: showDoctors ? 0 : -verticalScale(9999),
              }
            ]}
          >
            <Text style={styles.doctorsSectionTitle}>
              Recommended Specialists
            </Text>
            <Text style={styles.doctorsSectionSubtitle}>
              Book appointments with verified doctors
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: verticalScale(10) }}>
              {doctors.map((doc, index) => renderDoctorCard(doc, index))}
            </ScrollView>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[styles.backToPredictionButton, { backgroundColor: color }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backToPredictionButtonText}>← Back to Prediction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingBottom: verticalScale(25),
    paddingHorizontal: scale(20),
    position: 'relative',
    overflow: 'hidden',
    marginLeft: -scale(22),
    marginRight: -scale(22),
    marginTop: Platform.OS === 'ios' ? -verticalScale(65) : -verticalScale(40),
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },
  headerContent: {
    paddingTop: verticalScale(80),
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(45),
    left: scale(15),
    width: scale(30),
    height: scale(30),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  backButtonText: {
    color: '#fff',
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: scale(22),
    fontWeight: '800',
    color: '#fff',
    marginBottom: verticalScale(6),
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: scale(14),
    color: '#f8fafc',
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: '90%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: scale(20),
    marginTop: verticalScale(12),
    marginHorizontal: scale(18),
    marginBottom: verticalScale(24),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultLabel: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: verticalScale(6),
  },
  resultValue: {
    fontSize: scale(20),
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: verticalScale(20),
    lineHeight: verticalScale(28),
  },
  symptomsText: {
    fontSize: scale(14),
    color: '#334155',
    lineHeight: verticalScale(20),
  },
  rawResultContainer: {
    marginTop: verticalScale(20),
    paddingTop: verticalScale(15),
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  rawDataText: {
    fontSize: scale(13),
    color: '#475569',
    lineHeight: verticalScale(18),
    marginBottom: verticalScale(4),
  },
  rawDataKey: {
    fontWeight: '600',
    color: '#1e293b',
  },
  doctorToggleContainer: {
    marginHorizontal: scale(18),
    marginBottom: verticalScale(20),
    width: width - scale(36),
    alignSelf: 'center',
  },
  doctorToggleButton: {
    borderRadius: scale(15),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorToggleIcon: {
    fontSize: scale(24),
  },
  doctorToggleText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '600',
    flex: 1,
    marginLeft: scale(10),
  },
  doctorToggleArrow: {
    color: '#fff',
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  doctorsSection: {
    marginHorizontal: scale(18),
    marginBottom: verticalScale(25),
    backgroundColor: '#f8fafc',
    borderRadius: scale(20),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  doctorsSectionTitle: {
    fontSize: scale(20),
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: verticalScale(5),
  },
  doctorsSectionSubtitle: {
    fontSize: scale(14),
    color: '#64748b',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: scale(18),
    marginBottom: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: scale(240),
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  doctorAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    marginRight: scale(15),
    backgroundColor: '#f1f5f9',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: scale(18),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: verticalScale(4),
  },
  doctorSpecialization: {
    fontSize: scale(14),
    color: '#64748b',
    marginBottom: verticalScale(6),
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: scale(13),
    color: '#f59e0b',
    fontWeight: '600',
    marginRight: scale(10),
  },
  experienceText: {
    fontSize: scale(12),
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(8),
  },
  doctorContact: {
    marginBottom: verticalScale(10),
  },
  contactLabel: {
    fontSize: scale(13),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(4),
  },
  contactValue: {
    fontSize: scale(14),
    color: '#1e293b',
    lineHeight: verticalScale(20),
  },
  doctorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(15),
  },
  actionButton: {
    flex: 0.48,
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: '600',
  },
  backToPredictionButton: {
    borderRadius: scale(30),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: verticalScale(20),
  },
  backToPredictionButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '700',
    textAlign: 'center',
  },
});
