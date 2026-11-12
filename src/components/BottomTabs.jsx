import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { carryColors as colors } from "../constants/theme";

const tabs = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "history", label: "History", icon: "time-outline" },
  { key: "scan", label: "Scan QR", icon: "scan-outline" },
  { key: "profile", label: "Profile", icon: "person-outline" },
];

export default function BottomTabs({ active = "home", onNavigate }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = active === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onNavigate(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Ionicons
              name={tab.icon}
              size={23}
              color={selected ? colors.primary : colors.muted}
            />

            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 13,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500",
  },

  selectedLabel: {
    color: colors.primary,
    fontWeight: "700",
  },
});
