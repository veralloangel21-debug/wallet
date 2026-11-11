import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { carryColors as colors } from "../constants/theme";
export default function QuickActions({ actions }) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          style={styles.action}
          onPress={action.onPress}
          accessibilityRole="button"
        >
          <View style={styles.iconBox}>
            <Ionicons name={action.icon} size={25} color={colors.primary} />
          </View>

          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginVertical: 24,
  },

  action: {
    flex: 1,
    alignItems: "center",
    gap: 9,
  },

  iconBox: {
    width: "100%",
    maxWidth: 70,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
