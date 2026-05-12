import { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Slider({ value, min, max, onChange }: SliderProps) {
  const trackWidthRef = useRef(0);
  const trackPageXRef = useRef(0);
  const containerRef = useRef<View>(null);
  const onChangeRef = useRef(onChange);
  const minRef = useRef(min);
  const maxRef = useRef(max);

  onChangeRef.current = onChange;
  minRef.current = min;
  maxRef.current = max;

  const fraction = max > min ? (value - min) / (max - min) : 0;

  const updateFromPageX = useCallback((pageX: number) => {
    const w = trackWidthRef.current;
    if (w <= 0) return;
    const localX = pageX - trackPageXRef.current;
    const clamped = Math.max(0, Math.min(localX, w));
    const newValue = Math.round(
      minRef.current + (clamped / w) * (maxRef.current - minRef.current),
    );
    onChangeRef.current(newValue);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        containerRef.current?.measure((_x, _y, _w, _h, pageX) => {
          trackPageXRef.current = pageX ?? 0;
          updateFromPageX(evt.nativeEvent.pageX);
        });
      },
      onPanResponderMove: (evt) => {
        updateFromPageX(evt.nativeEvent.pageX);
      },
    }),
  ).current;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  }, []);

  return (
    <View
      ref={containerRef}
      style={styles.container}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.trackBackground} pointerEvents="none" />
      <View
        style={[styles.trackFill, { width: `${fraction * 100}%` }]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.thumb,
          { left: `${fraction * 100}%`, marginLeft: -8 },
        ]}
        pointerEvents="none"
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
