import { Pressable, Text, StyleSheet } from 'react-native';

interface ModeChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function ModeChip({ label, active, onPress }: ModeChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        pressed && styles.chipPressed,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          active ? styles.chipTextActive : styles.chipTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: '#f2e728',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  chipInactive: {
    backgroundColor: '#fdf8f8',
  },
  chipPressed: {
    transform: [{ scale: 0.95 }],
  },
  chipText: {
    fontFamily: 'monospace',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  chipTextActive: {
    fontWeight: '700',
    color: '#000000',
  },
  chipTextInactive: {
    fontWeight: '400',
    color: '#000000',
  },
});
