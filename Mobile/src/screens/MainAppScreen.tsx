import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Language, UserProfile } from '../types';
import { Header } from '../components/common/Header';
import { BottomNavBar, MainTabType } from '../components/common/BottomNavBar';
import { HomeDashboardView } from '../components/dashboard/HomeDashboardView';
import { FeaturePlaceholderView } from '../components/dashboard/FeaturePlaceholderView';

interface MainAppScreenProps {
  user: UserProfile;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
}

export const MainAppScreen: React.FC<MainAppScreenProps> = ({
  user,
  lang,
  onLanguageChange,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<MainTabType>('home');

  return (
    <View style={styles.container}>
      {/* Fixed Top Header */}
      <Header lang={lang} onLanguageChange={onLanguageChange} />

      {/* Main Tab Screen Content */}
      <View style={styles.contentArea}>
        {activeTab === 'home' ? (
          <HomeDashboardView user={user} lang={lang} onLogout={onLogout} />
        ) : (
          <FeaturePlaceholderView
            tab={activeTab}
            user={user}
            lang={lang}
            onBackToHome={() => setActiveTab('home')}
          />
        )}
      </View>

      {/* Fixed 5-Tab Bottom Navigator */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentArea: {
    flex: 1,
  },
});
