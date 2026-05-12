import { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Slider({ value, min, max, onChange }: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<View>(null);

  const fraction = max > min ? (value - min) / (max - min) : 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateValue(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateValue(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const updateValue = (locationX: number) => {
    if (trackWidth <= 0) return;
    const clamped = Math.max(0, Math.min(locationX, trackWidth));
    const newValue = Math.round(min + (clamped / trackWidth) * (max - min));
    onChange(newValue);
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.trackBackground} />
      <View style={[styles.trackFill, { width: `${fraction * 100}%` }]} />
      <View
        style={[
          styles.thumb,
          { left: fraction * trackWidth - 8 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    justifyContent: 'center',
  },
  trackBackground: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#000000',
    opacity: 0.2,
  },
  trackFill: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#000000',
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: '#000000',
    borderRadius: 0,
  },
});
