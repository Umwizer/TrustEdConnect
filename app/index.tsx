import React from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SplashScreen() {
  const handleAdminPress = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#061B5E"
      />

      {/* Decorative circles */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIconContainer}>
          <Ionicons
            name="school"
            size={42}
            color="#FFA51F"
          />

          <View style={styles.logoBook}>
            <View style={styles.bookLeft} />
            <View style={styles.bookRight} />
          </View>
        </View>

        <Text style={styles.logoText}>
          <Text style={styles.logoPrimary}>TrustEd</Text>
          <Text style={styles.logoConnect}>Connect</Text>
        </Text>
      </View>

        Child image
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/primaryconnect-child.png')}
            style={styles.childImage}
            resizeMode="contain"
          />
        </View>

      {/* Welcome text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>
          Welcome to Trust Education Connect
        </Text>

        <Text style={styles.welcomeSubtitle}>
          Choose your account type to continue
        </Text>
      </View>

      {/* =========================
          ADMIN BUTTON
          ========================= */}

      <Pressable
        style={({ pressed }) => [
          styles.roleButton,
          styles.adminButton,
          pressed && styles.pressedButton,
        ]}
        onPress={handleAdminPress}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="person-outline"
            size={31}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.roleText}>
          Admin
        </Text>

        <Ionicons
          name="arrow-forward"
          size={30}
          color="#FFFFFF"
          style={styles.arrow}
        />
      </Pressable>

      {/* =========================
          TEACHER - COMING LATER
          ========================= */}

      
      <Pressable style={styles.roleButton}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="person-outline"
            size={31}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.roleText}>
          Teacher
        </Text>

        <Ionicons
          name="arrow-forward"
          size={30}
          color="#FFFFFF"
          style={styles.arrow}
        />
      </Pressable>
     

      {/* =========================
          PARENT - COMING LATER
          ========================= */}

      
      <Pressable style={styles.roleButton}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="people-outline"
            size={31}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.roleText}>
          Parent
        </Text>

        <Ionicons
          name="arrow-forward"
          size={30}
          color="#FFFFFF"
          style={styles.arrow}
        />
      </Pressable>
     
    </View>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061B5E',
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 30,
    overflow: 'hidden',
  },

  /* Decorative circles */

  topCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#123E9B',
    opacity: 0.45,
    top: -150,
    left: -100,
  },

  bottomCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#123E9B',
    opacity: 0.45,
    bottom: -160,
    right: -110,
  },

  /* Logo */

  logoContainer: {
    alignItems: 'center',
    marginTop: 5,
  },

  logoIconContainer: {
    width: 68,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  logoBook: {
    position: 'absolute',
    bottom: 1,
    flexDirection: 'row',
    width: 50,
    height: 15,
  },

  bookLeft: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 8,
    transform: [{ skewY: '-10deg' }],
  },

  bookRight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 8,
    transform: [{ skewY: '10deg' }],
  },

  logoText: {
    marginTop: 7,
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -1,
  },

  logoPrimary: {
    color: '#FFFFFF',
  },

  logoConnect: {
    color: '#FFA51F',
  },

  /* Child image */

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 230,
    maxHeight: 360,
    marginTop: 8,
    backgroundClip: 'absolute',
  },

  childImage: {
    width: '92%',
    height: '100%',
  },

  /* Welcome text */

  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 15,
  },

  welcomeSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 17,
    textAlign: 'center',
  },

  /* Role button */

  roleButton: {
    height: 92,
    width: '100%',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  adminButton: {
    backgroundColor: '#1555E8',
  },

  iconContainer: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 18,
  },

  roleText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },

  arrow: {
    marginLeft: 10,
  },

  pressedButton: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});