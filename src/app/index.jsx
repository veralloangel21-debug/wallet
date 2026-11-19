import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* MAIN WELCOME CONTENT */}
        <View style={styles.hero}>
          {/* CARRY LOGO */}
          <Image
            source={require("../../assets/carry-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* HEADLINE */}
          <Text style={styles.heading}>Your Everyday{"\n"}E-Wallet</Text>

          {/* DESCRIPTION */}
          <Text style={styles.description}>
            Send, receive, and manage your money
            {"\n"}with ease — all in one place.
          </Text>
        </View>

        {/* BOTTOM BUTTONS */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/register")}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>Create an Account</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.outlineButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/login")}
            accessibilityRole="button"
          >
            <Text style={styles.outlineText}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030908",
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 36,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  hero: {
    flex: 1,
    minHeight: 380,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "100%",
    maxWidth: 310,
    height: 135,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "800",
    lineHeight: 43,
    letterSpacing: -0.8,
    textAlign: "center",
    marginTop: 42,
  },

  description: {
    color: "#A0B4AC",
    fontSize: 15,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 20,
  },

  actions: {
    width: "100%",
    gap: 16,
    marginTop: 28,
  },

  primaryButton: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryText: {
    color: "#030908",
    fontSize: 16,
    fontWeight: "800",
  },

  outlineButton: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  outlineText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});
