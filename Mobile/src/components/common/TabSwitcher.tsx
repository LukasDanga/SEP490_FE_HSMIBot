import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';

interface TabSwitcherProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
  loginLabel: string;
  registerLabel: string;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  onTabChange,
  loginLabel,
  registerLabel,
}) => {
  const handleSelect = (tab: 'login' | 'register') => {
    if (tab !== activeTab) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      onTabChange(tab);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect('login')}
        style={[styles.tabBtn, activeTab === 'login' && styles.tabBtnActive]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'login' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          {loginLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect('register')}
        style={[styles.tabBtn, activeTab === 'register' && styles.tabBtnActive]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'register' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          {registerLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 3,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  tabTextInactive: {
    color: Colors.textSecondary,
  },
});
