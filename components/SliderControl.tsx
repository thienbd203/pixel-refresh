import { View, Text, StyleSheet } from 'react-native';
import Slider from './Slider';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  badge?: string;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  badge,
  onChange,
  minLabel,
  maxLabel,
}: SliderControlProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>■ {label}</Text>
        {badge != null && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <Slider value={value} min={min} max={max} onChange={onChange} />

      {(minLabel != null || maxLabel != null) && (
        <View style={styles.labelsRow}>
          <Text style={styles.rangeLabel}>{minLabel ?? ''}</Text>
          <Text style={styles.rangeLabel}>{maxLabel ?? ''}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: '#000000',
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#fdf8f8',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#444748',
    textTransform: 'uppercase',
  },
  badgeContainer: {
    backgroundColor: '#f2e728',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  badgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.5,
    textTransform: 'uppercase',
  },
});
