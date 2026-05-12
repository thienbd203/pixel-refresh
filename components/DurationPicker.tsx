import { View, Pressable, Text, StyleSheet } from 'react-native';

interface DurationPickerProps {
  options: { label: string; value: number }[];
  selectedValue: number;
  onSelect: (value: number) => void;
}

export function DurationPicker({ options, selectedValue, onSelect }: DurationPickerProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selectedValue === option.value;
        const isLast = index === options.length - 1;
        return (
          <Pressable
            key={option.label}
            onPress={() => onSelect(option.value)}
            style={[
              styles.option,
              isSelected ? styles.optionSelected : styles.optionDefault,
              !isLast && styles.optionBorderRight,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                isSelected ? styles.optionTextSelected : styles.optionTextDefault,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBorderRight: {
    borderRightWidth: 1.5,
    borderRightColor: '#000000',
  },
  optionSelected: {
    backgroundColor: '#000000',
  },
  optionDefault: {
    backgroundColor: '#fdf8f8',
  },
  optionText: {
    fontFamily: 'monospace',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  optionTextSelected: {
    color: '#fdf8f8',
    fontWeight: '700',
  },
  optionTextDefault: {
    color: '#000000',
    fontWeight: '400',
  },
});
