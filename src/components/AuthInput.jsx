import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { carryColors as colors } from "../constants/theme";

export default function AuthInput({
  label,
  placeholder,
  icon = "person-outline",
  value,
  onChangeText,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={colors.muted} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secure && !visible}
          editable={editable}
        />

        {secure && (
          <Pressable
            onPress={() => setVisible(!visible)}
            accessibilityLabel={visible ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={21}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 9,
  },

  inputContainer: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 12,
  },
});
