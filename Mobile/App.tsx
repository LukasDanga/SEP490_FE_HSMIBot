import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Language, UserProfile } from './src/types';
import { Colors } from './src/theme/colors';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainAppScreen } from './src/screens/MainAppScreen';

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.appContainer}>
          {currentUser ? (
            <MainAppScreen
              user={currentUser}
              lang={lang}
              onLanguageChange={setLang}
              onLogout={handleLogout}
            />
          ) : (
            <AuthScreen
              lang={lang}
              onLanguageChange={setLang}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
