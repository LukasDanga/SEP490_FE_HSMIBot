import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { Header } from '../components/common/Header';
import { TabSwitcher } from '../components/common/TabSwitcher';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

interface AuthScreenProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  lang,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <View style={styles.container}>
      {/* Top Fixed Header with Brand, Live Status & Language Switcher */}
      <Header lang={lang} onLanguageChange={onLanguageChange} />

      {/* Main Content Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Segmented Tab Switcher */}
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
            loginLabel={t.tabLogin}
            registerLabel={t.tabRegister}
          />

          {/* Conditional Screen Rendering */}
          {activeTab === 'login' ? (
            <LoginForm
              lang={lang}
              onLoginSuccess={onLoginSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          ) : (
            <RegisterForm
              lang={lang}
              onLoginSuccess={onLoginSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
});
