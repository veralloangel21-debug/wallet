import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import CarryButton from "../components/CarryButton";
import WalletArtwork from "../components/WalletArtwork";
import { carryColors as colors } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  const goToRegister = () => {
    router.push("/register");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#0D251B", colors.background, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CARRY BRAND */}
        <View style={styles.brandContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="wallet-outline" size={26} color={colors.primary} />
          </View>

          <Text style={styles.brandName}>
            Carry<Text style={styles.brandDot}>.</Text>
          </Text>
        </View>

        {/* WALLET DESIGN */}
        <View style={styles.artworkContainer}>
          <WalletArtwork />
        </View>

        {/* WELCOME CONTENT */}
        <View style={styles.introContainer}>
          <Text style={styles.heading}>
            Your wallet,{"\n"}
            <Text style={styles.highlight}>everywhere.</Text>
          </Text>

          <Text style={styles.description}>
            Send, pay, receive, and manage your money. All in one convenient
            place.
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <CarryButton title="Get Started" showArrow onPress={goToRegister} />

          <CarryButton
            title="I already have an account"
            variant="outline"
            onPress={goToLogin}
          />

          <Text style={styles.footer}>Secure • Simple • Everywhere</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 28,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  brandName: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -1,
  },

  brandDot: {
    color: colors.primary,
  },

  artworkContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 18,
  },

  introContainer: {
    alignItems: "center",
    marginBottom: 26,
  },

  heading: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "800",
    textAlign: "center",
    color: colors.text,
    letterSpacing: -1,
  },

  highlight: {
    color: colors.primary,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
    textAlign: "center",
    marginTop: 16,
    maxWidth: 330,
  },

  actions: {
    width: "100%",
    gap: 14,
  },

  footer: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 16,
  },
});
