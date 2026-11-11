import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AuthInput from "../components/AuthInput";
import AuthScreen from "../components/AuthScreen";
import CarryButton from "../components/CarryButton";

import { carryColors as colors } from "../constants/theme";
import { loginUser } from "../services/authStorage";

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) return;

    if (!username.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your username and password.",
      );
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(username, password);

      if (!user) {
        Alert.alert("Login Failed", "Incorrect username or password.");
        return;
      }

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      title="Welcome Back!"
      subtitle="Log in to Carry and continue managing your money."
    >
      {/* USERNAME */}
      <AuthInput
        label="Username"
        placeholder="Enter your username"
        icon="person-outline"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />

      {/* PASSWORD */}
      <AuthInput
        label="Password"
        placeholder="Enter your password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secure
        editable={!loading}
      />

      {/* LOGIN BUTTON */}
      <View style={styles.buttonContainer}>
        <CarryButton
          title={loading ? "Logging In..." : "Log In"}
          onPress={handleLogin}
          disabled={loading}
          showArrow={!loading}
        />
      </View>

      {/* REGISTER LINK */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.link}>Register</Text>
        </Pressable>
      </View>

      {/* SECURITY NOTE */}
      <View style={styles.security}>
        <Ionicons
          name="shield-checkmark-outline"
          size={17}
          color={colors.primary}
        />

        <Text style={styles.securityText}>
          Carry — Your Wallet, Everywhere.
        </Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 28,
  },

  footerText: {
    fontSize: 14,
    color: colors.muted,
  },

  link: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },

  security: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 42,
  },

  securityText: {
    fontSize: 12,
    color: colors.muted,
  },
});
