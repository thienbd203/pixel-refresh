import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ToggleRowProps {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

export function ToggleRow({ label, description, active, onToggle }: ToggleRowProps) {
  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={[styles.track, active ? styles.trackActive : styles.trackInactive]}>
        <View
          style={[
            styles.thumb,
            active ? styles.thumbActive : styles.thumbInactive,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
    gap: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1b1b',
  },
  description: {
    fontSize: 14,
    color: '#444748',
    opacity: 0.7,
  },
  track: {
    width: 48,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000000',
    padding: 3,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: '#000000',
  },
  trackInactive: {
    backgroundColor: '#fdf8f8',
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  thumbActive: {
    backgroundColor: '#fdf8f8',
    alignSelf: 'flex-end',
  },
  thumbInactive: {
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
  },
});
