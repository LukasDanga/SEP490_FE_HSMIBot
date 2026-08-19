import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Cpu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onLanguageChange }) => {
  const t = translations[lang];

  const handleLangToggle = (newLang: Language) => {
    if (newLang !== lang) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      onLanguageChange(newLang);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Logo & Name */}
      <View style={styles.brandRow}>
        <LinearGradient
          colors={['#2563EB', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoBadge}
        >
          <Cpu color="#FFFFFF" size={18} strokeWidth={2.5} />
        </LinearGradient>
        <View>
          <Text style={styles.brandText}>{t.brandName}</Text>
          <View style={styles.statusRow}>
            <View style={styles.pulseDotWrapper}>
              <View style={styles.pulseDot} />
            </View>
            <Text style={styles.statusText}>{t.systemOnline}</Text>
          </View>
        </View>
      </View>

      {/* Language Switcher Pill */}
      <View style={styles.langPillContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleLangToggle('vi')}
          style={[styles.langBtn, lang === 'vi' && styles.langBtnActive]}
        >
          <Text style={[styles.langBtnText, lang === 'vi' && styles.langBtnTextActive]}>
            🇻🇳 VI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleLangToggle('en')}
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
        >
          <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>
            🇺🇸 EN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  pulseDotWrapper: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  langPillContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  langBtnTextActive: {
    color: Colors.primary,
  },
});
