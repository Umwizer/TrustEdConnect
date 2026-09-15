import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const Colors = {
  primary: '#1E3A8A',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGray: '#64748B',
  border: '#E2E8F0',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  pink: '#EC4899',
  green: '#10B981',
};

const CONTACTS: Record<string, { name: string; role: string; avatar: string; color: string; online: boolean }> = {
  '1': { name: 'Mr. Bosco K.', role: 'Mathematics Teacher', avatar: 'BK', color: Colors.blue, online: true },
  '2': { name: 'Ms. Aline M.', role: 'Class Teacher - S4', avatar: 'AM', color: Colors.purple, online: false },
  '3': { name: 'School Administration', role: 'Office', avatar: 'SA', color: Colors.orange, online: false },
  '4': { name: 'Mrs. Grace K.', role: 'English Teacher', avatar: 'GK', color: Colors.pink, online: false },
};

const INITIAL_MESSAGES: Record<string, { id: string; text: string; sender: 'me' | 'them'; time: string }[]> = {
  '1': [
    { id: '1', text: 'Good morning! I wanted to update you about John\'s progress in Mathematics.', sender: 'them', time: '09:15 AM' },
    { id: '2', text: 'Good morning Mr. Bosco. Thank you for reaching out!', sender: 'me', time: '09:20 AM' },
    { id: '3', text: 'He did very well in the last test. Keep encouraging him!', sender: 'them', time: '09:22 AM' },
    { id: '4', text: 'That\'s wonderful to hear. We will keep supporting him at home.', sender: 'me', time: '09:25 AM' },
    { id: '5', text: 'Excellent. Feel free to reach out if you have any questions.', sender: 'them', time: '10:30 AM' },
  ],
  '2': [
    { id: '1', text: 'Hello! Just a reminder that the parent meeting is scheduled for Friday at 3:00 PM.', sender: 'them', time: 'Yesterday' },
    { id: '2', text: 'Thank you for the reminder. I will be there.', sender: 'me', time: 'Yesterday' },
  ],
  '3': [
    { id: '1', text: 'Your fee payment of 100,000 RWF has been received. Thank you.', sender: 'them', time: '2 days ago' },
    { id: '2', text: 'Great, thank you for confirming.', sender: 'me', time: '2 days ago' },
  ],
  '4': [
    { id: '1', text: 'John needs to submit his essay by Monday.', sender: 'them', time: '3 days ago' },
    { id: '2', text: 'Noted. I\'ll make sure he completes it.', sender: 'me', time: '3 days ago' },
  ],
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = id || '1';

  const contact = CONTACTS[conversationId] || CONTACTS['1'];
  const [messages, setMessages] = useState(
    INITIAL_MESSAGES[conversationId] || INITIAL_MESSAGES['1']
  );
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'me' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulated auto-reply (for demo purposes)
    setTimeout(() => {
      const autoReply = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. I will get back to you shortly.',
        sender: 'them' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, autoReply]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={[styles.avatar, { backgroundColor: `${contact.color}20` }]}>
              <Text style={[styles.avatarText, { color: contact.color }]}>{contact.avatar}</Text>
              {contact.online && <View style={styles.onlineDot} />}
            </View>
            <View>
              <Text style={styles.headerName}>{contact.name}</Text>
              <Text style={styles.headerRole}>
                {contact.online ? 'Online' : contact.role}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={22} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <View
                key={msg.id}
                style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}
              >
                {!isMe && (
                  <View style={[styles.messageAvatar, { backgroundColor: `${contact.color}20` }]}>
                    <Text style={[styles.messageAvatarText, { color: contact.color }]}>
                      {contact.avatar}
                    </Text>
                  </View>
                )}
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeThem]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.textGray} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  keyboardContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { fontSize: 14, fontWeight: '800' },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  headerRole: { fontSize: 12, color: Colors.textGray, marginTop: 1 },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: { flex: 1, backgroundColor: Colors.bg },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  messageRowMe: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  messageRowThem: { alignSelf: 'flex-start' },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAvatarText: { fontSize: 10, fontWeight: '800' },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '100%',
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: { fontSize: 14.5, lineHeight: 20 },
  messageTextMe: { color: Colors.white },
  messageTextThem: { color: Colors.textDark },
  messageTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  messageTimeMe: { color: '#BFDBFE' },
  messageTimeThem: { color: Colors.textGray },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.bg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14.5,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
});