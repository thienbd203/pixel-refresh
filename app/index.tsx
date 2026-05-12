import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { ModeChip } from '../components/ModeChip';
import { DurationPicker } from '../components/DurationPicker';
import { SliderControl } from '../components/SliderControl';
import { ToggleRow } from '../components/ToggleRow';

type Mode = 'RAINBOW' | 'WHITE' | 'RED' | 'GREEN' | 'BLUE' | 'GRAYSCALE' | 'PIXEL_WALK';

const MODES: Mode[] = ['RAINBOW', 'WHITE', 'RED', 'GREEN', 'BLUE', 'GRAYSCALE', 'PIXEL_WALK'];

const MODE_LABELS: Record<Mode, string> = {
  RAINBOW: 'RAINBOW',
  WHITE: 'WHITE',
  RED: 'RED',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  GRAYSCALE: 'GRAYSCALE',
  PIXEL_WALK: 'PIXEL WALK',
};

const DURATION_OPTIONS = [
  { label: '5 MIN', value: 5 },
  { label: '10 MIN', value: 10 },
  { label: '30 MIN', value: 30 },
  { label: '60 MIN', value: 60 },
];

function getSpeedLabel(s: number): string {
  if (s > 80) return 'OPTIMAL';
  if (s > 50) return 'MEDIUM';
  return 'LOW';
}

export default function SettingsScreen() {
  const [mode, setMode] = useState<Mode>('RAINBOW');
  const [duration, setDuration] = useState(10);
  const [speed, setSpeed] = useState(85);
  const [brightness, setBrightness] = useState(85);
  const [keepScreenOn, setKeepScreenOn] = useState(true);
  const [hideStatusBar, setHideStatusBar] = useState(false);

  const handleStart = () => {
    router.push({
      pathname: '/session',
      params: {
        mode,
        duration: String(duration),
        speed: String(speed),
        brightness: String(brightness),
        keepScreenOn: keepScreenOn ? '1' : '0',
        hideStatusBar: hideStatusBar ? '1' : '0',
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>■ PIXEL REFRESH</Text>
        <Text style={styles.headerTitle}>OLED TREATMENT</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>■ MODE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modeList}
          >
            {MODES.map((m) => (
              <ModeChip
                key={m}
                label={MODE_LABELS[m]}
                active={mode === m}
                onPress={() => setMode(m)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>■ DURATION</Text>
          <DurationPicker
            options={DURATION_OPTIONS}
            selectedValue={duration}
            onSelect={setDuration}
          />
        </View>

        <View style={styles.slidersRow}>
          <View style={styles.sliderWrapper}>
            <SliderControl
              label="SPEED"
              value={speed}
              min={0}
              max={100}
              badge={getSpeedLabel(speed)}
              onChange={setSpeed}
              minLabel="LOW"
              maxLabel="HIGH"
            />
          </View>
          <View style={styles.sliderWrapper}>
            <SliderControl
              label="BRIGHTNESS"
              value={brightness}
              min={0}
              max={100}
              badge={`${brightness}%`}
              onChange={setBrightness}
              minLabel="MIN"
              maxLabel="MAX"
            />
          </View>
        </View>

        <View style={styles.togglesContainer}>
          <ToggleRow
            label="Keep screen on"
            description="System enforced during treatment"
            active={keepScreenOn}
            onToggle={() => setKeepScreenOn((v) => !v)}
          />
          <View style={styles.toggleDivider} />
          <ToggleRow
            label="Hide status bar"
            description="Immersive mode for full coverage"
            active={hideStatusBar}
            onToggle={() => setHideStatusBar((v) => !v)}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>START TREATMENT</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f8',
  },
  header: {
    backgroundColor: '#fdf8f8',
    borderBottomWidth: 1.5,
    borderBottomColor: '#000000',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#444748',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#444748',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  modeList: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 24,
  },
  slidersRow: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  sliderWrapper: {
    flex: 1,
  },
  togglesContainer: {
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 12,
    backgroundColor: '#fdf8f8',
    overflow: 'hidden',
    marginBottom: 32,
  },
  toggleDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  startButton: {
    height: 56,
    backgroundColor: '#f2e728',
    borderWidth: 1.5,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  startButtonPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
  },
  startButtonText: {
    fontFamily: 'monospace',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  startButtonArrow: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 48,
  },
});
