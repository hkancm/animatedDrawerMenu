import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const THRESHOLD = SCREEN_WIDTH / 3;

const listItems = [
  "LIST_ITEM_1",
  "LIST_ITEM_2",
  "LIST_ITEM_3",
  "LIST_ITEM_4",
  "LIST_ITEM_5",
  "LIST_ITEM_6",
  "LIST_ITEM_7",
  "LIST_ITEM_8",
  "LIST_ITEM_9",
  "LIST_ITEM_10",
  "LIST_ITEM_11",
  "LIST_ITEM_12",
  "LIST_ITEM_13",
  "LIST_ITEM_14",
  "LIST_ITEM_15",
  "LIST_ITEM_16",
  "LIST_ITEM_17",
];
export default function App({ navigation }) {
  const translateX = useSharedValue(0);
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);

  useEffect(() => {
    progress.value = withRepeat(withSpring(0.5), -1, true);
    scale.value = withRepeat(withSpring(1), -1, true);
  }, []);
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.x = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(event.translationX + context.x, 0);
    },
    onEnd: () => {
      if (translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0);
      } else {
        translateX.value = withTiming(SCREEN_WIDTH / 2);
      }
    },
  });
  const rListStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 2],
      [0, 1],
    );
    return {
      opacity,
    };
  }, []);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: (progress.value * 100) / 2,
      transform: [
        { scale: scale.value },
        { rotate: `${progress.value * 2 * Math.PI}rad` },
      ],
    };
  }, []);
  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 2],
      [0, 3],
      Extrapolate.CLAMP,
    );

    const borderRadius = interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 2],
      [0, 15],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [
        { perspective: 250 },
        {
          translateX: translateX.value,
        },
        {
          rotateY: `-${rotate}deg`,
        },
      ],
    };
  }, []);

  const onPress = useCallback(() => {
    if (translateX.value > 0) {
      translateX.value = withTiming(0);
    } else {
      translateX.value = withTiming(SCREEN_WIDTH / 2);
    }
  }, []);

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}
    >
      <SafeAreaView style={[styles.container, styles.safe]}>
        <Animated.View style={[{ position: "absolute", top: 45 }, rListStyle]}>
          {listItems.map((item, i) => {
            return (
              <Text key={i} style={styles.text}>
                {item}
              </Text>
            );
          })}
        </Animated.View>
        <StatusBar style="inverted" hidden={false} />
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View
            style={[
              { backgroundColor: "white", flex: 1, justifyContent: "center" },
              rStyle,
            ]}
          >
            <TouchableOpacity
              onPress={onPress}
              style={{ margin: 15, position: "absolute", top: 20 }}
            >
              <Feather name="menu" size={32} color={BACKGROUND_COLOR} />
            </TouchableOpacity>

            <Animated.View
              style={[
                {
                  height: 100,
                  width: 100,
                  backgroundColor: "blue",
                  alignSelf: "center",
                },
                reanimatedStyle,
              ]}
            />
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const BACKGROUND_COLOR = "#1e1e23";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  safe: {
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginVertical: 5,
    padding: 5,
    fontWeight: "bold",
  },
});
