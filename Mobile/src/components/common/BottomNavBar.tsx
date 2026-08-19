import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Video, Map, ClipboardList, Settings } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

export type MainTabType = 'home' | 'camera' | 'map' | 'logs' | 'settings';

interface BottomNavBarProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  lang: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  lang,
}) => {
  const t = translations[lang];

  const handlePress = (tab: MainTabType) => {
    if (tab !== activeTab) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      onTabChange(tab);
    }
  };

  const navItems = [
    { key: 'home' as MainTabType, label: t.bottomNavHome, icon: Home },
    { key: 'camera' as MainTabType, label: t.bottomNavCamera, icon: Video },
    { key: 'map' as MainTabType, label: t.bottomNavMap, icon: Map },
    { key: 'logs' as MainTabType, label: t.bottomNavLogs, icon: ClipboardList },
    { key: 'settings' as MainTabType, label: t.bottomNavSettings, icon: Settings },
  ];

  return (
    <View style={styles.navContainer}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => handlePress(item.key)}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
              <IconComponent
                size={20}
                color={isActive ? Colors.primary : Colors.textSecondary}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 2,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primarySubtle,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
