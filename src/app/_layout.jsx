import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { WalletProvider } from "../contexts/WalletContext";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Display the Carry splash for 2 seconds
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShowSplash(false);
        }
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      splashOpacity.stopAnimation();
    };
  }, [splashOpacity]);

  return (
    <WalletProvider>
      <View style={styles.root}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        {/* CARRY BRANDED SPLASH SCREEN */}
        {showSplash && (
          <Animated.View
            pointerEvents="auto"
            style={[styles.splash, { opacity: splashOpacity }]}
          >
            <StatusBar hidden />

            <Image
              source={require("../../assets/images/carry-splash-full.png")}
              style={styles.artwork}
              resizeMode="cover"
            />
          </Animated.View>
        )}
      </View>
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#002818",
  },

  splash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
    backgroundColor: "#002818",
  },

  artwork: {
    width: "100%",
    height: "100%",
  },
});
