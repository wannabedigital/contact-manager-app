import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ItemAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface InfoItem {
  id?: number;
  text: string;
  subText?: string;
  onAction?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  actions?: ItemAction[];
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
  isSimpleText?: boolean;
}

export const InfoSection = ({
  title,
  items,
  isSimpleText = false,
}: InfoSectionProps) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {isSimpleText
        ? items.map((item, index) => (
            <Text key={index} style={styles.simpleText}>
              {item.text}
            </Text>
          ))
        : items.map((item) => (
            <View key={item.id || item.text} style={styles.row}>
              <View style={styles.content}>
                <Text style={styles.mainText}>{item.text}</Text>
                {item.subText && (
                  <Text style={styles.subText}>{item.subText}</Text>
                )}
              </View>

              <View style={styles.actionsContainer}>
                {item.actions ? (
                  item.actions.map((action, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={action.onPress}
                      style={styles.iconButton}
                    >
                      <Ionicons
                        name={action.icon}
                        size={28}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  ))
                ) : item.onAction && item.actionIcon ? (
                  <TouchableOpacity
                    onPress={item.onAction}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name={item.actionIcon}
                      size={28}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  simpleText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  mainText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
