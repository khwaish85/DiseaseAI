import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 667) * size;

// ---------------------- CONFIG OBJECTS ----------------------

const inputFields = {
  Common: ['symptoms'],
  Heart: ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'],
  Diabetes: ['pregnancies', 'glucose', 'bloodpressure', 'skinthickness', 'insulin', 'bmi', 'dpf', 'age'],
  Parkinsons: Array.from({ length: 22 }, (_, i) => `f${i}`),
  Liver: ['age', 'gender', 'total_bilirubin', 'direct_bilirubin', 'alk_phosphate', 'alamine_aminotransferase', 'aspartate_aminotransferase', 'total_proteins', 'albumin', 'ag_ratio'],
};

const diseaseToEndpointMap = {
  Common: '/predict',
  Heart: '/predict-heart-disease',
  Diabetes: '/predict-diabetes',
  Parkinsons: '/predict-parkinsons',
  Liver: '/predict-liver',
  Lung: '/predict-lung-disease',
};

const doctorSpecialists = {
  Common: [
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
    }
  ],
  Heart: [
    {
      name: 'Dr. Robert Williams',
      specialization: 'Cardiologist',
      phone: '+1-555-0125',
      address: '789 Heart Institute, Suite 305, New York, NY 10003',
      rating: 4.9,
      experience: '20 years',
      avatar: require('../assets/doctor.png'),
    },
    {
      name: 'Dr. Emily Davis',
      specialization: 'Cardiovascular Surgeon',
      phone: '+1-555-0126',
      address: '321 Cardiac Center, Floor 4, New York, NY 10004',
      rating: 4.7,
      experience: '18 years',
      avatar: require('../assets/doctor.png'),
    }
  ],
  Diabetes: [
    {
      name: 'Dr. Lisa Martinez',
      specialization: 'Endocrinologist',
      phone: '+1-555-0127',
      address: '654 Diabetes Clinic, Suite 201, New York, NY 10005',
      rating: 4.8,
      experience: '16 years',
      avatar: require('../assets/doctor.png'),
    },
    {
      name: 'Dr. James Wilson',
      specialization: 'Diabetologist',
      phone: '+1-555-0128',
      address: '987 Metabolic Center, Floor 3, New York, NY 10006',
      rating: 4.9,
      experience: '14 years',
      avatar: require('../assets/doctor.png'),
    }
  ],
  Parkinsons: [
    {
      name: 'Dr. Amanda Taylor',
      specialization: 'Neurologist',
      phone: '+1-555-0129',
      address: '147 Neurology Institute, Suite 502, New York, NY 10007',
      rating: 4.9,
      experience: '22 years',
      avatar: require('../assets/doctor.png'),
    },
    {
      name: 'Dr. David Brown',
      specialization: 'Movement Disorder Specialist',
      phone: '+1-555-0130',
      address: '258 Brain Health Center, Floor 5, New York, NY 10008',
      rating: 4.8,
      experience: '19 years',
      avatar: require('../assets/doctor.png'),
    }
  ],
  Liver: [
    {
      name: 'Dr. Jennifer Garcia',
      specialization: 'Hepatologist',
      phone: '+1-555-0131',
      address: '369 Liver Clinic, Suite 301, New York, NY 10009',
      rating: 4.7,
      experience: '17 years',
      avatar: require('../assets/doctor.png'),
    },
    {
      name: 'Dr. Kevin Lee',
      specialization: 'Gastroenterologist',
      phone: '+1-555-0132',
      address: '741 Digestive Health Center, Floor 2, New York, NY 10010',
      rating: 4.8,
      experience: '15 years',
      avatar: require('../assets/doctor.png'),
    }
  ],
  Lung: [
    {
      name: 'Dr. Maria Rodriguez',
      specialization: 'Pulmonologist',
      phone: '+1-555-0133',
      address: '852 Respiratory Center, Suite 401, New York, NY 10011',
      rating: 4.9,
      experience: '21 years',
      avatar: require('../assets/doctor.png'),
    },
    {
      name: 'Dr. Thomas Anderson',
      specialization: 'Thoracic Surgeon',
      phone: '+1-555-0134',
      address: '963 Lung Institute, Floor 6, New York, NY 10012',
      rating: 4.8,
      experience: '18 years',
      avatar: require('../assets/doctor.png'),
    }
  ],
};

const diseaseConfig = {
  Common: {
    color: '#667eea',
    icon: require('../assets/common.png'),
    illustration: require('../assets/common.png'),
    title: 'Common Disease Prediction',
    subtitle: 'Describe your symptoms to get AI-powered health insights',
    placeholderText: 'e.g., Fever, Headache, Cough',
  },
  Heart: {
    color: '#f5576c',
    icon: require('../assets/heart.png'),
    illustration: require('../assets/heart.png'),
    title: 'Heart Disease Assessment',
    subtitle: 'Comprehensive cardiovascular health evaluation',
    placeholderText: 'e.g., 60 (age), 1 (male), 2 (cp)',
  },
  Diabetes: {
    color: '#4facfe',
    icon: require('../assets/diabetes.png'),
    illustration: require('../assets/diabetes.png'),
    title: 'Diabetes Risk Analysis',
    subtitle: 'Advanced glucose and metabolic assessment',
    placeholderText: 'e.g., 2 (pregnancies), 120 (glucose)',
  },
  Parkinsons: {
    color: '#a8edea',
    icon: require('../assets/parkinsons.png'),
    illustration: require('../assets/parkinsons.png'),
    title: "Parkinson's Disease Screening",
    subtitle: 'Neural pattern analysis for early detection',
    placeholderText: 'e.g., 0.123 (f0)',
  },
  Liver: {
    color: '#43e97b',
    icon: require('../assets/liver.png'),
    illustration: require('../assets/liver.png'),
    title: 'Liver Function Assessment',
    subtitle: 'Comprehensive hepatic health evaluation',
    placeholderText: 'e.g., 45 (age), 1.2 (bilirubin)',
  },
  Lung: {
    color: '#fa709a',
    icon: require('../assets/lung.png'),
    illustration: require('../assets/lung.png'),
    title: 'Lung Disease Detection',
    subtitle: 'AI-powered X-ray analysis for respiratory health',
    placeholderText: 'Upload chest X-ray image',
  },
};

const fieldLabels = {
  age: 'Age (Years)',
  sex: 'Gender (0: Female, 1: Male)',
  cp: 'Chest Pain Type (0-3)',
  trestbps: 'Resting Blood Pressure (mm Hg)',
  chol: 'Cholesterol Level (mg/dl)',
  fbs: 'Fasting Blood Sugar > 120 mg/dl (0: No, 1: Yes)',
  restecg: 'Resting ECG Results (0-2)',
  thalach: 'Maximum Heart Rate Achieved',
  exang: 'Exercise Induced Angina (0: No, 1: Yes)',
  oldpeak: 'ST Depression Induced by Exercise',
  slope: 'Slope of Peak Exercise ST Segment (0-2)',
  ca: 'Number of Major Vessels (0-3)',
  thal: 'Thalassemia (0: normal, 1: fixed defect, 2: reversible defect)',
  pregnancies: 'Number of Pregnancies',
  glucose: 'Glucose Level (mg/dL)',
  bloodpressure: 'Blood Pressure (mm Hg)',
  skinthickness: 'Skin Thickness (mm)',
  insulin: 'Insulin Level (mu U/ml)',
  bmi: 'BMI (kg/m²)',
  dpf: 'Diabetes Pedigree Function',
  symptoms: 'Symptoms Description',
  gender: 'Gender (0: Female, 1: Male)',
  total_bilirubin: 'Total Bilirubin',
  direct_bilirubin: 'Direct Bilirubin',
  alk_phosphate: 'Alkaline Phosphatase',
  alamine_aminotransferase: 'Alanine Aminotransferase',
  aspartate_aminotransferase: 'Aspartate Aminotransferase',
  total_proteins: 'Total Proteins',
  albumin: 'Albumin',
  ag_ratio: 'Albumin/Globulin Ratio',
  ...Object.fromEntries(Array.from({ length: 22 }, (_, i) => [`f${i}`, `Feature ${i + 1}`])),
};

// ---------------------- MAIN COMPONENT ----------------------

export default function PredictForm({ route, navigation }) {
  const { disease } = route.params;
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(verticalScale(50)))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const inputAnimations = useState(
    inputFields[disease] ? inputFields[disease].map(() => new Animated.Value(0)) : []
  )[0];

  // Doctor section animation
  const doctorSectionTranslateY = useState(new Animated.Value(-verticalScale(80)))[0];

  // For scrolling to top
  const scrollViewRef = useRef(null);

  const baseURL = 'http://192.168.1.8:5001'; // Your backend
  const config = diseaseConfig[disease];
  const doctors = doctorSpecialists[disease] || [];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(config.color || '#667eea');

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

    if (inputAnimations.length > 0) {
      const staggeredAnimations = inputAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 60,
          useNativeDriver: true,
        })
      );
      Animated.stagger(60, staggeredAnimations).start();
    }

    // Animate doctors section when shown
    if (showDoctors) {
      Animated.timing(doctorSectionTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(doctorSectionTranslateY, {
        toValue: -verticalScale(80),
        duration: 400,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#f8fafc');
    };
  }, [showDoctors, disease, config.color]);

  const handleImagePick = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) {
        setImage(res.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const endpoint = diseaseToEndpointMap[disease];

    if (!endpoint) {
      Alert.alert('Error', 'No API endpoint found for this disease.');
      setLoading(false);
      return;
    }

    try {
      let response;

      if (disease === 'Lung') {
        if (!image) {
          Alert.alert('Missing Image', 'Please select an X-ray image before predicting.');
          setLoading(false);
          return;
        }

        const formDataObj = new FormData();
        formDataObj.append('image', {
          uri: image.uri,
          name: image.fileName || 'lung_xray.jpg',
          type: image.type || 'image/jpeg'
        });

        response = await fetch(baseURL + endpoint, {
          method: 'POST',
          body: formDataObj,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        const urlEncoded = new URLSearchParams();
        const requiredFields = inputFields[disease];

        for (const field of requiredFields) {
          if (formData[field] === undefined || formData[field] === null || String(formData[field]).trim() === '') {
            Alert.alert('Missing Input', `Please enter a value for: ${fieldLabels[field] || field}`);
            setLoading(false);
            return;
          }
          urlEncoded.append(field, formData[field]);
        }

        response = await fetch(baseURL + endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: urlEncoded.toString()
        });
      }

      if (!response.ok) {
        let errorText = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.error) {
            errorText = errorJson.error;
          } else if (errorJson && errorJson.message) {
            errorText = errorJson.message;
          }
        } catch (parseError) {
          errorText = await response.text();
        }
        throw new Error(errorText);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error(`Invalid JSON response from server. Content-Type: ${contentType}. Response: ${textResponse}`);
      }

      const resultJson = await response.json();
      if (resultJson?.prediction !== undefined) {
        navigation.navigate('Result', { result: resultJson, diseaseName: config.title });
      } else if (resultJson?.error) {
        throw new Error(resultJson.error);
      } else {
        Alert.alert('Prediction Result', JSON.stringify(resultJson, null, 2));
      }

    } catch (err) {
      Alert.alert('Prediction Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCallDoctor = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleBookAppointment = (doctor) => {
    Alert.alert(
      'Book Appointment',
      `Would you like to book an appointment with ${doctor.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Now',
          onPress: () => handleCallDoctor(doctor.phone),
        },
        {
          text: 'Book Online',
          onPress: () => {
            Alert.alert('Booking Confirmed', `Appointment request sent to ${doctor.name}. They will contact you shortly.`);
          },
        },
      ]
    );
  };

  // Toggle and animate doctor section, scroll to it if opening
  const toggleDoctorsSection = () => {
    setShowDoctors(prev => !prev);
    setTimeout(() => {
      if (!showDoctors && scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 200);
  };

  const renderDoctorCard = (doctor, index) => (
    <View key={index} style={styles.doctorCard}>
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
          style={[styles.actionButton, { backgroundColor: '#059669' }]}
          onPress={() => handleCallDoctor(doctor.phone)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: config.color }]}
          onPress={() => handleBookAppointment(doctor)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>📅 Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={config.color} />
      <View
        style={[styles.header, { backgroundColor: config.color }]}
      >
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
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
            <Image source={config.icon} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>{config.title}</Text>
            <Text style={styles.headerSubtitle}>{config.subtitle}</Text>
          </View>
          {config.illustration && (
            <Image
              source={config.illustration}
              style={styles.illustration}
              resizeMode="contain"
            />
          )}
        </Animated.View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {/* Form Content */}
            {disease === 'Lung' ? (
              <Animated.View
                style={[
                  styles.imageSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={[styles.imagePicker, { backgroundColor: config.color }]}
                  onPress={handleImagePick}
                  activeOpacity={0.8}
                >
                  <Image source={config.icon} style={styles.imagePickerIcon} />
                  <Text style={styles.imagePickerText}>Upload Chest X-ray</Text>
                  <Text style={styles.imagePickerSubtext}>
                    Tap to select an image from your gallery
                  </Text>
                </TouchableOpacity>
                {image && (
                  <Animated.View
                    style={[
                      styles.selectedImageContainer,
                      {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                      }
                    ]}
                  >
                    <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                    <Text style={styles.selectedImageText}>Image Selected: {image.fileName || 'X-ray'}</Text>
                  </Animated.View>
                )}
              </Animated.View>
            ) : (
              <View style={styles.inputSection}>
                <Text style={styles.sectionTitle}>Enter Medical Parameters</Text>
                <Text style={styles.sectionSubtitle}>
                  Please provide the required information below:
                </Text>
                {inputFields[disease].map((field, index) => (
                  <Animated.View
                    key={field}
                    style={[
                      styles.inputContainer,
                      {
                        opacity: inputAnimations[index],
                        transform: [
                          {
                            translateY: inputAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [verticalScale(20), 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.inputLabel}>
                      {fieldLabels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <TextInput
                      placeholder={config.placeholderText || `Enter ${fieldLabels[field] || field}`}
                      keyboardType={field === 'symptoms' ? 'default' : 'numeric'}
                      style={[
                        styles.input,
                        field === 'symptoms' && styles.textAreaInput
                      ]}
                      placeholderTextColor="#94a3b8"
                      multiline={field === 'symptoms'}
                      numberOfLines={field === 'symptoms' ? 4 : 1}
                      onChangeText={(value) => setFormData(prev => ({ ...prev, [field]: value }))}
                      value={formData[field] || ''}
                      returnKeyType={index === inputFields[disease].length - 1 ? 'done' : 'next'}
                      blurOnSubmit={index === inputFields[disease].length - 1}
                    />
                  </Animated.View>
                ))}
              </View>
            )}

            {/* Submit Button */}
            <Animated.View
              style={[
                styles.submitContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: loading ? '#94a3b8' : config.color }
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Analyzing...' : 'Get Prediction'}
                </Text>
                {!loading && (
                  <Text style={styles.submitButtonIcon}>→</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Toggle Button for Specialist Doctors */}
            <Animated.View
              style={[
                styles.doctorToggleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.doctorToggleButton, { backgroundColor: config.color }]}
                onPress={toggleDoctorsSection}
                activeOpacity={0.8}
              >
                <Text style={styles.doctorToggleIcon}>👨‍⚕️</Text>
                <Text style={styles.doctorToggleText}>
                  {showDoctors ? 'Hide' : 'View'} Specialist Doctors
                </Text>
                <Text style={styles.doctorToggleArrow}>
                  {showDoctors ? '↑' : '↓'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Specialist Doctors Section (now under Get Prediction) */}
            {showDoctors && (
              <Animated.View
                style={[
                  styles.doctorsSection,
                  {
                    transform: [{ translateY: doctorSectionTranslateY }],
                    opacity: doctorSectionTranslateY.interpolate({
                      inputRange: [-verticalScale(80), 0],
                      outputRange: [0, 1],
                    }),
                  }
                ]}
              >
                <Text style={styles.doctorsSectionTitle}>
                  Recommended Specialists
                </Text>
                <Text style={styles.doctorsSectionSubtitle}>
                  Book appointments with verified doctors
                </Text>
                {doctors.map((doctor, index) => renderDoctorCard(doctor, index))}
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------- STYLES ----------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(20),
    position: 'relative',
    overflow: 'hidden',
    marginTop: Platform.OS === 'ios' ? -65 : -40,
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },
  headerContent: {
    paddingTop: 80,
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scale(60) : scale(45),
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
  headerInfo: {
    alignItems: 'center',
    width: '100%',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(8),
  },
  headerIcon: {
    width: scale(60),
    height: scale(60),
    marginBottom: verticalScale(10),
    tintColor: '#fff',
  },
  headerTitle: {
    fontSize: scale(22),
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: verticalScale(4),
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: scale(14),
    color: 'rgba(255,255,255,0.93)',
    textAlign: 'center',
    lineHeight: verticalScale(20),
    maxWidth: '90%',
    marginBottom: verticalScale(5),
  },
  illustration: {
    position: 'absolute',
    bottom: verticalScale(0),
    right: scale(0),
    width: scale(110),
    height: scale(110),
    opacity: 0.16,
    zIndex: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
    backgroundColor: '#f8fafc',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginTop: verticalScale(-15),
    borderTopLeftRadius: scale(26),
    borderTopRightRadius: scale(26),
    paddingTop: verticalScale(35),
    paddingHorizontal: scale(18),
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
    minHeight: verticalScale(450),
  },
  doctorToggleContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    width: '100%',
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
    marginBottom: verticalScale(25),
    backgroundColor: '#f8fafc',
    borderRadius: scale(20),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  imageSection: {
    alignItems: 'center',
    marginBottom: verticalScale(8),
    width: '100%',
  },
  imagePicker: {
    width: '100%',
    borderRadius: scale(18),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    paddingVertical: verticalScale(30),
    paddingHorizontal: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerIcon: {
    width: scale(44),
    height: scale(44),
    marginBottom: verticalScale(10),
    tintColor: '#fff',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: scale(17),
    fontWeight: '700',
    marginBottom: verticalScale(4),
    textAlign: 'center',
  },
  imagePickerSubtext: {
    color: 'rgba(255,255,255,0.91)',
    fontSize: scale(13),
    textAlign: 'center',
    paddingHorizontal: scale(5),
  },
  selectedImageContainer: {
    marginTop: verticalScale(18),
    alignItems: 'center',
    width: '100%',
  },
  selectedImage: {
    width: scale(170),
    height: scale(170),
    borderRadius: scale(16),
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#e2e8f0',
    marginBottom: verticalScale(8),
  },
  selectedImageText: {
    fontSize: scale(13),
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 2,
  },
  inputSection: {
    marginBottom: verticalScale(18),
    width: '100%',
  },
  sectionTitle: {
    fontSize: scale(26),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: verticalScale(4),
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: scale(14),
    color: '#64748b',
    marginBottom: verticalScale(18),
    lineHeight: verticalScale(19),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: verticalScale(16),
    width: '100%',
  },
  inputLabel: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(-15),
    paddingLeft: scale(3),
    textAlign: 'left',
  },
  input: {
    marginTop: 30,
    backgroundColor: '#f8fafc',
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: scale(13),
    paddingVertical: verticalScale(12),
    fontSize: scale(15),
    color: '#1e293b',
    minHeight: verticalScale(50),
    width: '100%',
  },
  textAreaInput: {
    paddingVertical: verticalScale(12),
    textAlignVertical: 'top',
    minHeight: verticalScale(80),
  },
  submitContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(0),
    width: '100%',
  },
  submitButton: {
    marginTop: 30,
    borderRadius: scale(30),
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 6,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  submitButtonIcon: {
    color: '#fff',
    fontSize: scale(20),
    marginLeft: scale(7),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
