import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

const diseases = [
  { name: 'Common Disease', image: require('../assets/common.png'), route: 'PredictForm', params: { disease: 'Common' }, color: '#E0E7FF', iconColor: '#6366F1' },
  { name: 'Heart Disease', image: require('../assets/heart.png'), route: 'PredictForm', params: { disease: 'Heart' }, color: '#FFE4E6', iconColor: '#EF4444' },
  { name: 'Diabetes', image: require('../assets/diabetes.png'), route: 'PredictForm', params: { disease: 'Diabetes' }, color: '#BAE6FD', iconColor: '#3B82F6' },
  { name: 'Liver Disease', image: require('../assets/liver.png'), route: 'PredictForm', params: { disease: 'Liver' }, color: '#BBF7D0', iconColor: '#10B981' },
  { name: 'Lung Disease', image: require('../assets/lung.png'), route: 'PredictForm', params: { disease: 'Lung' }, color: '#FFFBEB', iconColor: '#F59E2B' },
  { name: "Parkinson's", image: require('../assets/parkinsons.png'), route: 'PredictForm', params: { disease: 'Parkinsons' }, color: '#FAD2C9', iconColor: '#8B5CF6' },
];

const chatResponses = {
  greetings: [
    "Hello! I'm your health assistant. How can I help you today?",
    "Hi there! Ready for your health check?",
    "Welcome! I'm here to help with your health needs.",
    "Good day! What health topic would you like to explore?",
  ],
  help: [
    "I can help you with:\n• Disease prediction analysis\n• Health tips and advice\n• Booking appointments\n• Understanding symptoms",
    "Here are some ways I can assist:\n• Check your health status\n• Get personalized tips\n• Schedule doctor visits\n• Learn about conditions",
    "I'm here to help with:\n• Health assessments\n• Medical information\n• Preventive care tips\n• Finding the right doctor",
  ],
  booking: [
    "I can help you book an appointment! Would you like to:\n• Find a nearby doctor\n• Schedule a general checkup\n• Book a specialist consultation",
    "Let's get you an appointment! What type of doctor do you need to see?",
    "I can help with scheduling. What kind of appointment are you looking for?",
  ],
  diseases: [
    "We offer predictions for 6 different conditions. Which one interests you?",
    "You can test for: Heart Disease, Diabetes, Liver Disease, Lung Disease, Parkinson's, or common conditions.",
    "Our AI can assess various health conditions. Which would you like to check?",
  ],
  tips: [
    "Here's a quick tip: Stay hydrated! Drink at least 8 glasses of water daily.",
    "Health tip: Get 7-8 hours of sleep for better immune function.",
    "Remember: Regular exercise for just 30 minutes can boost your mood!",
    "Tip: Eat colorful fruits and vegetables for better nutrition.",
  ],
  default: [
    "I'm not sure about that. Can you ask me about health predictions, appointments, or tips?",
    "I specialize in health-related queries. Try asking about disease predictions or booking appointments.",
    "I'm here for your health needs. Would you like to check a condition or get health tips?",
  ],
  goodbye: [
    "Take care of your health! I'm here when you need me.",
    "Stay healthy! Feel free to ask if you need any health assistance.",
    "Have a great day and remember to prioritize your health!",
  ],
};

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('Hi Khwaish! Need help picking a disease to test?');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hi Khwaish! Need help picking a disease to test?', isBot: true, timestamp: new Date() }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const fadeAnim = useState(new Animated.Value(1))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];
  const chatAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]).start(() => setTimeout(pulse, 3000));
    };
    pulse();

    // Change message every 5 seconds when chat is not expanded
    const interval = setInterval(() => {
      if (!chatExpanded) {
        const allMessages = [
          ...chatResponses.greetings,
          ...chatResponses.tips,
          'Click on a disease to start prediction!',
          'How can I help you today?',
        ];
        const randomMessage = allMessages[Math.floor(Math.random() * allMessages.length)];
        setCurrentMessage(randomMessage);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [chatExpanded]);

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
    Animated.timing(chatAnimation, {
      toValue: chatExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return chatResponses.greetings[Math.floor(Math.random() * chatResponses.greetings.length)];
    }
    
    if (message.includes('help') || message.includes('assist')) {
      return chatResponses.help[Math.floor(Math.random() * chatResponses.help.length)];
    }
    
    if (message.includes('book') || message.includes('appointment') || message.includes('doctor')) {
      return chatResponses.booking[Math.floor(Math.random() * chatResponses.booking.length)];
    }
    
    if (message.includes('disease') || message.includes('predict') || message.includes('test') || message.includes('check')) {
      return chatResponses.diseases[Math.floor(Math.random() * chatResponses.diseases.length)];
    }
    
    if (message.includes('tip') || message.includes('advice') || message.includes('health')) {
      return chatResponses.tips[Math.floor(Math.random() * chatResponses.tips.length)];
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('thanks')) {
      return chatResponses.goodbye[Math.floor(Math.random() * chatResponses.goodbye.length)];
    }
    
    // Check for specific diseases
    if (message.includes('heart')) {
      return "I see you're interested in heart health! Tap on the Heart Disease card to start your assessment.";
    }
    if (message.includes('diabetes')) {
      return "Diabetes is a serious condition. Click on the Diabetes card to check your risk factors.";
    }
    if (message.includes('liver')) {
      return "Liver health is crucial! You can assess your liver condition using our prediction tool.";
    }
    if (message.includes('lung')) {
      return "Respiratory health is important. Check the Lung Disease card for assessment.";
    }
    if (message.includes('parkinson')) {
      return "For Parkinson's assessment, click on the Parkinson's card above.";
    }
    
    return chatResponses.default[Math.floor(Math.random() * chatResponses.default.length)];
  };

  const sendMessage = () => {
    if (userInput.trim() === '') return;

    const newUserMessage = {
      id: Date.now(),
      text: userInput,
      isBot: false,
      timestamp: new Date(),
    };

    setChatMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(userInput);
      const newBotMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setChatMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    if (action === 'help') {
      sendQuickMessage('I need help');
    } else if (action === 'book') {
      sendQuickMessage('I want to book an appointment');
    }
  };

  const sendQuickMessage = (message) => {
    setUserInput(message);
    setTimeout(() => sendMessage(), 100);
  };

  const filteredDiseases = diseases.filter(d =>
    d.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isBot ? styles.botMessageText : styles.userMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerAccent} />
      <View style={styles.headerRow}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.username}>Khwaish</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarShadow}>
            <Image source={require('../assets/profile_avatar.png')} style={styles.avatar} />
          </View>
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <Image source={require('../assets/search_icon.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search diseases..."
          placeholderTextColor="#A78BFA"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Disease Prediction</Text>
        <Text style={styles.sectionSubtitle}>Select a category to assess your health</Text>

        <View style={styles.grid}>
          {filteredDiseases.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                { backgroundColor: item.color, borderColor: '#A78BFA' },
              ]}
              onPress={() => navigation.navigate(item.route, item.params)}
              activeOpacity={0.9}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '22', borderColor: '#A78BFA' }]}>
                <Image source={item.image} style={styles.image} />
              </View>
              <Text style={[styles.title, { color: item.iconColor }]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.tipsHeader}>Daily Health Tips</Text>
        <View style={styles.tipCard}>
          <Image source={require('../assets/water_drop.png')} style={styles.tipIcon} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.tipTitle}>Stay hydrated</Text>
            <Text style={styles.tipText}>Drink at least 8 glasses of water daily</Text>
          </View>
        </View>
        <View style={styles.tipCard}>
          <Image source={require('../assets/sleep.png')} style={styles.tipIcon} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.tipTitle}>Sleep Well</Text>
            <Text style={styles.tipText}>Aim for 7-8 hours of sleep every night</Text>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Enhanced Chatbot */}
      <View style={styles.chatbotContainer}>
        {!chatExpanded && (
          <Animated.View style={[styles.popupBubble, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.popupBubbleText}>{currentMessage}</Text>
            <View style={styles.popupArrow} />
          </Animated.View>
        )}
        
        <TouchableWithoutFeedback onPress={toggleChat}>
          <Animated.View
            style={[
              styles.chatbotPopup,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
                width: chatExpanded ? width - 40 : 60,
                height: chatExpanded ? 400 : 60,
                backgroundColor: '#7C3AED',
                borderColor: '#A78BFA',
              },
            ]}
          >
            <View style={styles.chatbotContent}>
              <Image source={require('../assets/chatbot_avatar.png')} style={styles.chatbotAvatar} />
              
              {chatExpanded && (
                <Animated.View style={[styles.chatContainer, { opacity: chatAnimation }]}>
                  <Text style={styles.chatbotName}>Health Assistant</Text>
                  
                  {/* Chat Messages */}
                  <View style={styles.chatMessagesContainer}>
                    <FlatList
                      data={chatMessages}
                      renderItem={renderMessage}
                      keyExtractor={(item) => item.id.toString()}
                      showsVerticalScrollIndicator={false}
                      style={styles.messagesList}
                    />
                    
                    {isTyping && (
                      <View style={[styles.messageContainer, styles.botMessage]}>
                        <Text style={[styles.messageText, styles.botMessageText]}>
                          Typing...
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Input Area */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.messageInput}
                      placeholder="Type your message..."
                      placeholderTextColor="#A78BFA"
                      value={userInput}
                      onChangeText={setUserInput}
                      onSubmitEditing={sendMessage}
                      multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                      <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Quick Actions */}
                  <View style={styles.quickActions}>
                    <TouchableOpacity 
                      style={styles.quickActionButton}
                      onPress={() => handleQuickAction('help')}
                    >
                      <Text style={styles.quickActionText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.quickActionButton}
                      onPress={() => handleQuickAction('book')}
                    >
                      <Text style={styles.quickActionText}>Book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.quickActionButton}
                      onPress={() => sendQuickMessage('health tips')}
                    >
                      <Text style={styles.quickActionText}>Tips</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  headerAccent: {
    height: 0,
    backgroundColor: '#A78BFA',
    width: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, paddingHorizontal: 20, marginTop: 10 },
  welcomeSection: {},
  welcome: { fontSize: 16, color: '#000000', fontWeight: '500' },
  username: { fontSize: 28, fontWeight: 'bold', color: '#7C3AED', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#000000' },
  avatarContainer: { alignItems: 'center', justifyContent: 'center' },
  avatarShadow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#fff' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 48,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
    marginHorizontal: 20,
  },
  searchIcon: { width: 22, height: 22, marginRight: 8, tintColor: '#A78BFA' },
  searchBar: { flex: 1, fontSize: 16, color: '#7C3AED', fontWeight: '600' },
  container: { padding: 20, paddingTop: 0 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#7C3AED', marginTop: 8 },
  sectionSubtitle: { fontSize: 13, color: '#000000', marginBottom: 14 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    width: '48%',
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
  },
  image: { width: 32, height: 32, resizeMode: 'contain' },
  title: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  tipsHeader: { fontSize: 18, fontWeight: '700', color: '#7C3AED', marginTop: 10 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 2,
    shadowColor: '#A78BFA',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  tipIcon: { width: 26, height: 26, resizeMode: 'contain' },
  tipTitle: { fontSize: 15, fontWeight: '700', color: '#7C3AED' },
  tipText: { fontSize: 13, color: '#A78BFA' },
  
  // Enhanced Chatbot Styles
  chatbotContainer: { position: 'absolute', bottom: 90, right: 20 },
  popupBubble: {
    position: 'absolute',
    top: -6,
    right: 80,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    maxWidth: 280,
    minWidth: 200,
    shadowColor: '#A78BFA',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.2,
    borderColor: '#A78BFA',
  },
  popupBubbleText: {
    fontSize: 13,
    color: '#7C3AED',
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'left',
  },
  popupArrow: {
    position: 'absolute',
    top: 18,
    right: -7,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
  },
  chatbotPopup: {
    borderRadius: 30,
    padding: 10,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    maxWidth: width - 40,
    minHeight: 60,
    borderWidth: 2,
  },
  chatbotContent: { flex: 1 },
  chatbotAvatar: { width: 40, height: 40, borderRadius: 20, marginBottom: 5 },
  chatContainer: { flex: 1, marginTop: 5 },
  chatbotName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 8 },
  
  // Chat Messages
  chatMessagesContainer: { flex: 1, marginBottom: 10 },
  messagesList: { maxHeight: 200 },
  messageContainer: {
    marginVertical: 2,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#A78BFA',
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 16,
  },
  botMessageText: {
    color: '#fff',
  },
  userMessageText: {
    color: '#fff',
  },
  
  // Input Area
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A78BFA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    color: '#7C3AED',
    fontSize: 12,
    maxHeight: 60,
  },
  sendButton: {
    backgroundColor: '#A78BFA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#A78BFA',
    borderRadius: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});