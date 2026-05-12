import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import * as Brightness from 'expo-brightness';
import { StatusBar } from 'expo-status-bar';

type Mode = 'RAINBOW' | 'WHITE' | 'RED' | 'GREEN' | 'BLUE' | 'GRAYSCALE' | 'PIXEL_WALK';

function getColors(mode: Mode): string[] {
  switch (mode) {
    case 'WHITE':
      return ['#FFFFFF'];
    case 'RED':
      return ['#FF0000'];
    case 'GREEN':
      return ['#00FF00'];
    case 'BLUE':
      return ['#0000FF'];
    case 'GRAYSCALE':
      return ['#111111', '#444444', '#888888', '#CCCCCC', '#FFFFFF'];
    case 'RAINBOW':
      return ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    case 'PIXEL_WALK':
      return ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];
    default:
      return ['#FFFFFF'];
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function SessionScreen() {
  const params = useLocalSearchParams<{
    mode: Mode;
    duration: string;
    speed: string;
    brightness: string;
    keepScreenOn: string;
    hideStatusBar: string;
  }>();

  const mode = (params.mode ?? 'RAINBOW') as Mode;
  const duration = parseInt(params.duration ?? '10', 10);
  const speed = parseInt(params.speed ?? '85', 10);
  const brightnessVal = parseInt(params.brightness ?? '85', 10);
  const keepScreenOn = params.keepScreenOn === '1';
  const hideStatusBar = params.hideStatusBar === '1';

  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [colorIndex, setColorIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const originalBrightness = useRef<number | null>(null);

  const colors = useMemo(() => getColors(mode), [mode]);

  if (keepScreenOn) {
    useKeepAwake();
  }

  useEffect(() => {
    const setupBrightness = async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          originalBrightness.current = await Brightness.getBrightnessAsync();
          await Brightness.setBrightnessAsync(1.0);
        }
      } catch (err) {
        console.warn('Brightness error:', err);
      }
    };
    setupBrightness();

    return () => {
      if (originalBrightness.current !== null) {
        Brightness.setBrightnessAsync(originalBrightness.current).catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      handleEnd();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, timeLeft]);

  useEffect(() => {
    if (isPaused || colors.length <= 1) return;

    const delay = Math.max(100, 3100 - speed * 30);

    const interval = setInterval(() => {
      setColorIndex((idx) => (idx + 1) % colors.length);
    }, delay);

    return () => clearInterval(interval);
  }, [isPaused, colors, speed]);

  const handleEnd = useCallback(() => {
    if (originalBrightness.current !== null) {
      Brightness.setBrightnessAsync(originalBrightness.current).catch(() => {});
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {hideStatusBar && <StatusBar hidden />}

      <Pressable
        style={[
          styles.colorScreen,
          {
            backgroundColor: colors[colorIndex],
            opacity: brightnessVal / 100,
            width,
            height,
          },
        ]}
        onPress={() => setIsPaused(true)}
      />

      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseLabel}>■ PAUSED</Text>

            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

            <View style={styles.pauseDivider} />

            <View style={styles.pauseButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.stopButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleEnd}
              >
                <Text style={styles.stopButtonText}>■ STOP</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.resumeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setIsPaused(false)}
              >
                <Text style={styles.resumeButtonText}>▶ RESUME →</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  colorScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pauseCard: {
    backgroundColor: '#fdf8f8',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 12,
    width: '100%',
    maxWidth: 360,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  pauseLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#444748',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  timerText: {
    fontFamily: 'monospace',
    fontSize: 56,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -2,
    marginVertical: 16,
  },
  pauseDivider: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginBottom: 24,
  },
  pauseButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  stopButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
  },
  resumeButton: {
    flex: 1.5,
    height: 56,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeButtonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#fdf8f8',
  },
  buttonPressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    opacity: 0.9,
  },
});
