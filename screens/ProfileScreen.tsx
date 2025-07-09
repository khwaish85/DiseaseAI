import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';

// If you want a gradient header, you can use react-native-linear-gradient. Here, we'll use a solid color for simplicity.

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerBg} />
          <View style={styles.avatarWrapper}>
            <Image source={require('../assets/profile_avatar.png')} style={styles.avatar} />
          </View>
          <Text style={styles.name}>Khwaish Yadav</Text>
          <Text style={styles.email}>khwaish@example.com</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>Male</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DOB:</Text>
            <Text style={styles.infoValue}>15/08/2000</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>+91 95402 00085</Text>
          </View>
        </View>

        {/* Option List */}
        <View style={styles.optionsContainer}>
          <ProfileOption icon="✏️" label="Edit Profile" />
          <ProfileOption icon="🔒" label="Change Password" />
          <ProfileOption icon="⚙️" label="App Settings" />
          <ProfileOption icon="🔔" label="Notifications" />
          <ProfileOption icon="❓" label="Help & Support" />
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Option Card Component
function ProfileOption({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.optionCard} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.optionIcon}>{icon}</Text>
      <Text style={styles.optionText}>{label}</Text>
      <Text style={styles.optionArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
    paddingBottom: 100,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
    marginBottom: 10,
  },
  headerBg: {
    backgroundColor: '#6366F1',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 250,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    zIndex: -1,
  },
  avatarWrapper: {
    marginTop: Platform.OS === 'ios' ? 40 : 30,
    marginBottom: 10,
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    borderRadius: 60,
    backgroundColor: '#fff',
    padding: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#E0E7FF',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 10,
    letterSpacing: 0.2,
  },
  email: {
    fontSize: 15,
    color: '#111111',
    marginTop: 2,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#fff',
    width: '88%',
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    marginBottom: 18,
    shadowColor: '#6366F1',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  infoLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  optionsContainer: {
    width: '92%',
    marginTop: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    shadowColor: '#6366F1',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3730A3',
    flex: 1,
  },
  optionArrow: {
    fontSize: 20,
    color: '#A5B4FC',
    marginLeft: 8,
  },
  logoutButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#DC2626',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom:60,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
