import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { carryColors as colors } from "../constants/theme";

export default function ProfileMenuItem({ item, onPress, last = false }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        !last && styles.divider,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBox}>
        <Ionicons name={item.icon} size={22} color={colors.primary} />
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 75,
    paddingVertical: 11,
    gap: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  iconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 11,
  },
});
