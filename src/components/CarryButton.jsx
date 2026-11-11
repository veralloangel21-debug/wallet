import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { carryColors as colors } from "../constants/theme";

export default function CarryButton({
  title,
  onPress,
  variant = "primary",
  showArrow = false,
  disabled = false,
}) {
  const primary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primary : styles.outline,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.text,
            { color: primary ? colors.background : colors.text },
          ]}
        >
          {title}
        </Text>

        {showArrow && (
          <Ionicons name="arrow-forward" size={20} color={colors.background} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dimmed: {
    opacity: 0.65,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
